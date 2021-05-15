/* eslint-disable react/require-default-props */
import React, { useEffect } from 'react';
import './App.global.css';
import Sidebar from 'components/Sidebar/Sidebar';

// Redux
import { configureStore, IAppState } from 'redux/reducers';
import { Provider, useDispatch, useSelector } from 'react-redux';
import actions from 'redux/actions';
import Page from 'components/Page/Page';
import Navbar from 'components/Navbar/Navbar';

export const store = configureStore();

type WrapperProps = {
  children?: JSX.Element;
};

const Wrapper = ({ children }: WrapperProps) => {
  const dispatch = useDispatch();

  const currentPage = useSelector(
    (state: IAppState) => state.pageState.currentPage
  );

  useEffect(() => {
    const doAsync = async () => {
      dispatch(actions.pages.fetchAllPagesActionCreator());
    };
    doAsync();
  }, [dispatch]);

  return (
    <div
      id="app"
      className="flex flex-row absolute inset-0 bg-white text-center h-full justify justify-center overflow-hidden"
    >
      <Sidebar />
      <div id="page-container" className="flex flex-col flex-grow">
        <Navbar />
        <div className="overflow-scroll min-h-full">
          <div className="w-1/2 mx-auto my-6 min-h-full ">
            {currentPage ? <Page /> : <h1>Add a page to get started!</h1>}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <Wrapper />
    </Provider>
  );
};

export default App;
