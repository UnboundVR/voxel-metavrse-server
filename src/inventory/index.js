import routes from './routes';

export default function(server, dbConn) {
  routes.init(server, dbConn);
}
