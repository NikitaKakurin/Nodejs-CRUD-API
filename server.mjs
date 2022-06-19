import { Console } from 'console';
import http from 'http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'


const db = [{"id": "io"},{"id": "i"},{"id": "qw"}];

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "GET":
      get(req, res)
    break

    case "POST":
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

function get (request, response) {
  console.log(request.url)
  if (request.url === "/api/user" || request.url === "/api/user/") {
    sendResponse(response, 200, db)
    return;
  }
  if(request.url.startsWith("/api/user/")){
    const reqParts = request.url.split('/');

    if(reqParts.length !== 4){
      sendResponse(response, 400, `wrong request: ${request.url}`);
      return;
    };

    const reqId = reqParts[3].toString();
    if(!uuidValidate(reqId)){
      sendResponse(response, 400, `userId ${reqId} is invalid (not uuid)`);
      return;
    };
    let resObj = db.find((user) => user.id===reqId);

    if(!resObj){
      sendResponse(response, 404, `user with id: ${reqId} - not found`)
      return;
    };

    sendResponse(response, 200, resObj)
    return;
  }
  sendResponse(response, 400,`wrong request: ${request.url}`);
}

function sendResponse(response, code, message){
  response.statusCode = code;
  response.setHeader("Content-Type", "application/json");
  response.write(JSON.stringify(message));
  response.end();
};

function post(request, response){
  
}