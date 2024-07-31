import * as React from 'react';
import { Trans } from 'react-i18next';
import { Link } from 'react-router-dom';

import '@components/footer.scss';
import { version } from '../../package.json';

export const Footer = () => {
  return (
    <div className='footer'>
      Vergo 
      &nbsp;- <a href="mailto:fabrice.rosito@gmail.com">Email</a> 
      &nbsp;- <Trans>footer.version.front</Trans>{version} 
      &nbsp;- <a href="https://github.com/Happykiller/vergo_front/issues" target="_blank"><Trans>footer.issues</Trans></a> 
      &nbsp;- <a href="https://github.com/users/Happykiller/projects/4/views/1" target="_blank"><Trans>footer.roadmap</Trans></a>
      &nbsp;- <Link to="/cgu" target="_blank" rel="noopener noreferrer">CGU</Link>
    </div>
  )
}