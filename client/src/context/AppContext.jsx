import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  name: null,
  email: null,
  password: null,
  userType: null,
  loading: false,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_USER_TYPE':
      return { ...state, userType: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setName = (name) => dispatch({ type: 'SET_NAME', payload: name });
  const setEmail = (email) => dispatch({ type: 'SET_EMAIL', payload: email });
  const setPassword = (password) => dispatch({ type: 'SET_PASSWORD', payload: password });
  const setUserType = (userType) => dispatch({ type: 'SET_USER_TYPE', payload: userType });
  const setLoading = (loading) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error) => dispatch({ type: 'SET_ERROR', payload: error });

  return (
    <AppContext.Provider
      value={{
        state,
        setName,
        setEmail,
        setPassword,
        setUserType,
        setLoading,
        setError,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
