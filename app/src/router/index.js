import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Dashboard from '../pages/Dashboard';
import Predict from '../pages/Predict';
import BatchPredict from '../pages/BatchPredict';
import ModelInfo from '../pages/ModelInfo';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
      {
        path: 'predict',
        element: <Predict />
      },
      {
        path: 'batch-predict',
        element: <BatchPredict />
      },
      {
        path: 'model',
        element: <ModelInfo />
      }
    ]
  }
]);

export default router;
