import { Container } from '@mui/material';
import { useState } from 'react';
import { RedisConnectionDetails } from '../types/types';
import RedisSinkConnectionForm from './RedisSinkConnectionForm';
import RedisSinkVerifyConnectionForm from './RedisSinkVerifyConnectionForm';
import { useContext } from 'react';
import TopicsContext from '../context/TopicsContext';

const RedisSinkForm = () => {
  const [formStateObj, setFormStateObj] = useState<RedisConnectionDetails>({
    url: '', // url must have "redis://" specified. should we change this?
    username: '',
    password: '',
  });

  const [isValidConnection, setIsValidConnection] = useState(false);
  const { topics } = useContext(TopicsContext);

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
            topics={topics}
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
