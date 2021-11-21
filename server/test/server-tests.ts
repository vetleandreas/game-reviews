import axios from 'axios';
import pool from '../src/mysql-pool';
import app from '../src/app';

let webServer: any;
beforeAll((done) => {
  // Use separate port for testing
  webServer = app.listen(3000, () => done());
});
