// src\pages\Profile.tsx
import React from 'react';
import Add from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import { client } from '@passwordless-id/webauthn';
import DeleteIcon from '@mui/icons-material/Delete';
import { Trans, useTranslation } from 'react-i18next';
import { Chip, Grid, Link, Slider } from '@mui/material';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import { Button, Divider, IconButton, Paper, Typography } from '@mui/material';
import { RegistrationEncoded } from '@passwordless-id/webauthn/dist/esm/types';

import '@pages/common.scss';
import Header from '@components/Header';
import { Input } from '@components/Input';
import { CODES } from '@src/commons/codes';
import { REGEX } from '@src/commons/REGEX';
import inversify from '@src/commons/inversify';
import { passkeyStore } from '@src/stores/passkeyStore';
import { FlashStore, flashStore} from '@components/Flash';
import { ContextStoreModel, contextStore } from '@src/stores/contextStore';
import { PasskeyUsecaseModel } from '@usecases/model/passkey.usecase.model';
import { UpdPasswordUsecaseModel } from '@usecases/updPassword/updPassword.usecase.model';
import { GetPasskeyForUserUsecaseModel } from '@usecases/getPasskeyForUser/getPasskeyForUser.usecase.model';

export const Profile = () => {
  const { t } = useTranslation();
  const flash:FlashStore = flashStore();
  const context:ContextStoreModel = contextStore();
  const passkeyStored = passkeyStore();
  const [passkey_label, setPasskey_label] = React.useState({
    value: '',
    valid: false
  });
  const [formEntities, setFormEntities] = React.useState({
    old: {
      value: '',
      valid: false
    },
    new: {
      value: '',
      valid: false
    },
    conf: {
      value: '',
      valid: false
    }
  });
  const [qry, setQry] = React.useState({
    loading: false,
    data: null,
    error: null
  });
  const [qryPasskeys, setQryPasskeys] = React.useState({
    loading: false,
    data: null,
    error: null
  });
  const [passkeys, setPasskeys] = React.useState<any>(null)

  const update = () => {
    setQry(qry => ({
      ...qry,
      error: null,
      loading: true
    }));

    inversify.updPasswordUsecase.execute({
      old_value: formEntities.old.value,
      new_value: formEntities.new.value,
      conf_value: formEntities.conf.value
    })
      .then((response:UpdPasswordUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          flash.open(t('profile.passwordUpdated'));
          setFormEntities({
            old: {
              value: '',
              valid: false
            },
            new: {
              value: '',
              valid: false
            },
            conf: {
              value: '',
              valid: false
            }
          });
        } else {
          inversify.loggerService.debug(response.error);
          setQry((qry:any) => ({
            ...qry,
            error: response.message
          }));
        }
      })
      .catch((error:any) => {
        setQry(qry => ({
          ...qry,
          error: error.message
        }));
      })
      .finally(() => {
        setQry(qry => ({
          ...qry,
          loading: false
        }));
      });
  }

  const handleVolumeChange = (event: Event, newValue: number | number[]) => {
    const volume = Array.isArray(newValue) ? newValue[0] : newValue;
    contextStore.setState({ volume }); // Met à jour le contexte avec la nouvelle valeur de volume
  };

  const formIsValid = () => {
    if (!formEntities.new.valid || !formEntities.old.valid || !formEntities.conf.valid || (formEntities.new.value !== formEntities.conf.value)) {
      return false;
    }
    return true;
  }

  const addPasskey = async () => {
    try {
      const challenge = crypto.randomUUID();
      const registration:RegistrationEncoded = await client.register(context.code, challenge, {
        "authenticatorType": "auto",
        "userVerification": "required",
        "discoverable": "preferred",
        "timeout": 60000,
        "attestation": true,
        "debug": false
      });

      const data = {
        label: passkey_label.value,
        challenge: challenge,
        hostname: location.hostname,
        registration: registration
      };
      inversify.loggerService.debug("Datas to record", data);
      const response = await inversify.createPasskeyUsecase.execute(data);
      if(! response.data) {
        throw new Error("Data empty");
      }
      passkeyStore.setState({ 
        passkey_id: response.data.id,
        user_code: context.code,
        challenge: challenge,
        credential_id: registration.credential.id
      });
      setPasskeys(null);
    } catch (error) {
      inversify.loggerService.error("Error creating credential", error);
    }
  }
  

  const deletePasskey = async (dto: any) => {
    await inversify.deletePasskeyUsecase.execute(dto);
    setPasskeys(null);
  }

  const activePasskey = async (dto: any) => {
    passkeyStore.setState({ 
      passkey_id: dto.passkey_id,
      user_code: dto.user_code,
      challenge: dto.challenge,
      credential_id: dto.credential_id
    });
    setPasskeys(null);
  }

  const defaultContentPasskeys = <Grid
    container
    display={passkeys?.length > 0?'flex':'none'}
  >
    <Grid
      container
      sx={{
        color: "#000000",
        fontWeight: "bold",
        backgroundColor: "#EA80FC",
        borderRadius: "5px 5px 0px 0px",
        fontSize: "0.875rem"
      }}
    >
      <Grid 
        xs={6}
        item
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Trans>profile.passkey.table.label</Trans>
      </Grid>
      <Grid
        item
        xs={6}
      >
      </Grid>
    </Grid>
    
    {passkeys?.map((passkey:PasskeyUsecaseModel) => {
      return (
      <Grid
        key={passkey.id}
        container
        sx={{
          backgroundColor: '#3C4042',
          marginBottom:'1px',
          "&:hover": {
            backgroundColor: "#606368"
          }
        }}
      >
        <Grid 
          xs={6}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
          title={passkey.label}
        >
          <Typography noWrap>{passkey.label}</Typography>
        </Grid>
        <Grid
          xs={6}
          item
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Delete  */}
          <IconButton 
            title={t('profile.passkey.table.delete')}
            onClick={(e) => {
              e.preventDefault();
              deletePasskey({
                passkey_id: passkey.id
              });
            }}>
            <DeleteIcon />
          </IconButton>

          {/* Active  */}
          <IconButton 
            title={t('profile.passkey.table.active')}
            disabled={(passkey?.id === passkeyStored.passkey_id)}
            onClick={(e) => {
              e.preventDefault();
              activePasskey({
                passkey_id: passkey.id,
                user_code: passkey.user_code,
                challenge: passkey.challenge,
                credential_id: passkey.credential_id
              });
            }}>
            <CheckIcon 
              sx={{
                color: passkey?.id === passkeyStored.passkey_id?'green':'grey'
              }}
            />
          </IconButton>
        </Grid>
      </Grid>
    )})}

  </Grid>;

  let contentPasskeys = <div></div>;
  if(qryPasskeys.loading) {
    contentPasskeys = <div><Trans>common.loading</Trans></div>;
  } else if(qryPasskeys.error) {
    contentPasskeys = <div><Trans>profiles.{qryPasskeys.error}</Trans></div>;
  } else if(passkeys === null) {
    setPasskeys([]);
    setQryPasskeys(qry => ({
      ...qry,
      loading: true
    }));
    inversify.getPasskeyForUserUsecase.execute()
      .then((response:GetPasskeyForUserUsecaseModel) => {
        if(response.message === CODES.SUCCESS) {
          setPasskeys(response.data);
        } else {
          inversify.loggerService.debug(response.error);
          setQryPasskeys((qry:any) => ({
            ...qry,
            error: response.message
          }));
        }
      })
      .catch((error:any) => {
        setQryPasskeys(qry => ({
          ...qry,
          error: error.message
        }));
      })
      .finally(() => {
        setQryPasskeys(qry => ({
          ...qry,
          loading: false
        }));
      });
  } else {
    contentPasskeys = defaultContentPasskeys;
  }

  let content = <div></div>;
  let errorMessage = <div></div>;

  if (qry.error) {
    errorMessage = <div><Trans>profile.{qry.error}</Trans></div>
  }

  if (qry.loading) {
    content = <Trans>common.loading</Trans>;
  } else {
    content = <form>
      <Grid
        container
      >
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Field old password */}
          <Input
            label={<Trans>profile.oldPassword</Trans>}
            tooltip={<Trans>REGEX.PASSWORD</Trans>}
            regex={REGEX.PASSWORD}
            type='password'
            entity={formEntities.old}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                old: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Field new password */}
          <Input
            label={<Trans>profile.newPassword</Trans>}
            tooltip={<Trans>REGEX.PASSWORD</Trans>}
            regex={REGEX.PASSWORD}
            type='password'
            entity={formEntities.new}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                new: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>
        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Field confirm password */}
          <Input
            label={<Trans>profile.confPassword</Trans>}
            tooltip={<Trans>REGEX.PASSWORD</Trans>}
            regex={REGEX.PASSWORD}
            type='password'
            entity={formEntities.conf}
            onChange={(entity:any) => { 
              setFormEntities({
                ... formEntities,
                conf: {
                  value: entity.value,
                  valid: entity.valid
                }
              });
            }}
            require
            virgin
          />
        </Grid>

        <Grid
          item
          xs={6}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Submit button */}
          <Button 
            type="submit"
            variant="contained"
            size="small"
            startIcon={<SystemUpdateAltIcon />}
            disabled={!formIsValid()}
            onClick={(e) => { 
              e.preventDefault();
              update();
            }}
          ><Trans>common.done</Trans></Button>
        </Grid>
      </Grid>
    </form>
  }

  return (
    <div className="app">
      <Header/>
      <div className="parent_container">
        <div className="container">
          <div className='title'>
            <Trans>profile.title</Trans>
          </div>
          <div>
            <Grid
              container
            >
              <Grid 
                xs={12}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.code</Trans>{context.code}
              </Grid>
              <Grid 
                xs={6}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.name_first</Trans>{context.name_first}
              </Grid>
              <Grid 
                xs={6}
                item
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <Trans>profile.name_last</Trans>{context.name_last}
              </Grid>
            </Grid>
            <Divider>
              <Chip label={<Trans>profile.password</Trans>} size="small" />
            </Divider>
            {content}

            <Divider>
              <Chip label={<Trans>profile.settings</Trans>} size="small" />
            </Divider>

            {/* Réglage du volume */}
            <Grid container>
              <Grid xs={12} item display="flex" flexDirection="column" alignItems="center">
                <Typography variant="body1">
                  <Trans>profile.volumeControl</Trans>: {Math.round(context.volume * 100)}%
                </Typography>
                <Slider
                  value={context.volume}
                  min={0}
                  max={1}
                  step={0.1}
                  onChange={handleVolumeChange}
                  valueLabelDisplay="auto"
                />
              </Grid>
            </Grid>

            <Divider
              sx={{
                paddingBottom: 1
              }}
            >
              <Chip label={<Trans>profile.passkeys</Trans>} size="small" />
            </Divider>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {/* Add passkey */}
              <Paper
                component="form"
                sx={{ 
                  p: '2px 4px', 
                  display: 'flex', 
                  alignItems: 'center'
                }}
              >
                <Input
                  label={<Trans>profile.passkey_label</Trans>}
                  tooltip={<Trans>REGEX.PASSKEY_LABEL</Trans>}
                  regex={REGEX.PASSKEY_LABEL}
                  entity={passkey_label}
                  onChange={(entity:any) => { 
                    setPasskey_label({
                      value: entity.value,
                      valid: entity.valid
                    });
                  }}
                  require
                  virgin
                />
                <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                <IconButton 
                  color="primary" 
                  sx={{ p: '10px' }} 
                  title={t('bank.joinTitle')}
                  disabled={!passkey_label.valid}
                  onClick={(e) => {
                    e.preventDefault();
                    addPasskey()
                  }}
                >
                  <Add />
                </IconButton>
              </Paper>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <Link href="ms-settings:savedpasskeys"><Trans>profile.keys</Trans></Link>
            </Grid>
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              {errorMessage}
            </Grid>
          </div>
          <div>
            {contentPasskeys}
          </div>
        </div>
      </div>
    </div>
  )
};