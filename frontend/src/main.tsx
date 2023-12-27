// Copyright © 2023 Navarrotech
import ReactDOM from 'react-dom/client';
import { Navigate, Routes, Route } from "react-router"
import { BrowserRouter } from "react-router-dom";

// Redux
import { Provider } from 'react-redux'
import store from './redux-store'

// Routes
import Welcome from './routes/Welcome';
import Join from './routes/Join';
import Game from './routes/Game';
import GameOutlet from './routes/GameOutlet';

// Stylesheet
import "./index.sass"

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <section className="section">
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route index path="/" element={<Navigate to="/welcome" />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/join" element={<Join />} />
          <Route path="/game" element={<GameOutlet />}>
            <Route path=":game_id" element={<Game />} />
          </Route>
          <Route path="*" element={<Navigate to="/welcome" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </section>
);
