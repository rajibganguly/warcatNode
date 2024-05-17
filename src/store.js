import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import departmentsSlice from './redux/slices/departmentSlice/departmentsSlice';

const persistConfig = {
  key: 'root',
  storage
};

const rootReducer = combineReducers({
  departments: departmentsSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
