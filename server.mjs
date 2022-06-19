import { Console } from 'console';
import http from 'http';


const db = [{"id": "io"},{"id": "i"},{"id": "qw"}];

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "GET":
      get(req, res)
    break
    default:
      // Send res for requests with no other response
      res.statusCode = 400
      res.write("No Response")
      res.end()
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

async function get (request, response) {
  console.log(request.url)
  if (request.url === "/api/user" || request.url === "/api/user/") {
    sendCode200(db)
    return;
  }
  if(request.url.startsWith("/api/user/")){
    const reqParts = request.url.split('/');

    if(reqParts.length !== 4){
      sendCode400(`wrong request: ${request.url}`);
      return;
    };

    const reqId = reqParts[3].toString();
    let resObj = db.find((user) => user.id===reqId);

    if(!resObj){
      sendCode400(`user with id: ${reqId} - not found`)
      return;
    };

    sendCode200(resObj)
    return;
  }
  sendCode400(req);

  function sendCode400(message){
    response.statusCode = 400
    response.setHeader("Content-Type", "application/json")
    response.write(JSON.stringify(message))
    response.end()
  }

  function sendCode200(message){
    response.statusCode = 400
    response.setHeader("Content-Type", "application/json")
    response.write(JSON.stringify(message))
    response.end()
  }
}

