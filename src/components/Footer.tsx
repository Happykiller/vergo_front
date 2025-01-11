import React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import '@components/footer.scss';
import { CODES } from '@src/commons/codes';
import inversify from '@src/commons/inversify';
import { SystemInfoUsecaseModel } from '@usecases/system/model/systemInfo.usecase.model';

export const Footer = () => {
  const [backVersion, setBackVersion] = React.useState('common.loading');

  if (backVersion === 'common.loading') {
    inversify.systemInfoUsecase.execute()
      .then((response:SystemInfoUsecaseModel) => {
        if(response.message === CODES.SUCCESS && response.data) {
          setBackVersion(response.data.version);
        } else {
          setBackVersion(`Error! ${response.error}`);
        }
      })
      .catch((error:any) => {
        setBackVersion(`Error! ${error}`);
      });
  }
  
  return (
    <div className='footer'>
      Vergo 
      &nbsp;- <a href="mailto:fabrice.rosito@gmail.com">Email</a> 
      &nbsp;- <Trans>footer.version.front</Trans>{process.env.VERSION} 
      &nbsp;- <Trans>footer.version.back</Trans><Trans>{backVersion}</Trans> 
      &nbsp;- <a href="https://github.com/Happykiller/vergo_front/issues" target="_blank"><Trans>footer.issues</Trans></a> 
      &nbsp;- <a href="https://github.com/users/Happykiller/projects/4/views/1" target="_blank"><Trans>footer.roadmap</Trans></a>
      &nbsp;- <Link to="/cgu" target="_blank" rel="noopener noreferrer">CGU</Link>
    </div>
  )
}