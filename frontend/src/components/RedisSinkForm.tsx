import { Container } from '@mui/material';
import { useState } from 'react';
import { RedisConnectionDetails } from '../types/types';
import RedisSinkConnectionForm from './RedisSinkConnectionForm';
import RedisSinkVerifyConnectionForm from './RedisSinkVerifyConnectionForm';

const RedisSinkForm = () => {
  const [formStateObj, setFormStateObj] = useState<RedisConnectionDetails>({
    url: '', // url must have "redis://" specified. should we change this?
    username: '',
    password: '',
  });

  const [isValidConnection, setIsValidConnection] = useState(false);

  return (
    <>
      <Container maxWidth="md">
        <RedisSinkVerifyConnectionForm
          isValidConnection={isValidConnection}
          setIsValidConnection={setIsValidConnection}
          formStateObj={formStateObj}
          setFormStateObj={setFormStateObj}
        />

        {isValidConnection && (
          <RedisSinkConnectionForm
            topics={['dbserver1.public.demo']} // need to remove the hard code. how do we get topics from the source connector into here?
            url={formStateObj.url}
            username={formStateObj.username}
            password={formStateObj.password}
          />
        )}
      </Container>
    </>
  );
};

export default RedisSinkForm;
