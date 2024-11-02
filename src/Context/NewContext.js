import { createContext } from 'react';

const Context = createContext({
    username: '',
    setUsername: () => {}
});

export default Context;