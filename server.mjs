import { Console } from 'console';
import http from 'http';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid'


const db = [];

const server = http.createServer((req, res) => {
  switch (req.method) {
    case "GET":
      get(req, res)
    break

    case "POST":
      post(req, res)
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

function get (req, res) {
  console.log(req.url)
  if (req.url === "/api/users" || req.url === "/api/users/") {
    sendResponse(res, 200, db)
    return;
  }
  if(req.url.startsWith("/api/users/")){
    const reqParts = req.url.split('/');

    if(reqParts.length !== 4){
      sendResponse(res, 404, `wrong request: ${req.url}`);
      return;
    };

    const reqId = reqParts[3].toString();
    if(!uuidValidate(reqId)){
      sendResponse(res, 400, `userId ${reqId} is invalid (not uuid)`);
      return;
    };
    let resObj = db.find((user) => user.id===reqId);

    if(!resObj){
      sendResponse(res, 404, `user with id: ${reqId} - not found`)
      return;
    };

    sendResponse(res, 200, resObj)
    return;
  }
  sendResponse(res, 404,`wrong request: ${req.url}`);
}

function sendResponse(response, code, message){
  response.statusCode = code;
  response.setHeader("Content-Type", "application/json");
  response.write(JSON.stringify(message));
  response.end();
};

function post(req, res){
  console.log(req.url);
  switch (req.url) {
    case "/api/users":
      let buffer = '';
      req.on('data', chunk => {
        buffer += chunk;
      });
      req.on('end', () => {
        const reqBody = JSON.parse(buffer);
        console.log(reqBody);
        if(reqBody.username && 
            typeof reqBody.username ==='string' &&
            reqBody.age && 
            typeof reqBody.age ==='number' &&
            reqBody.hobbies && 
            Array.isArray(reqBody.hobbies) &&
            reqBody.hobbies.every((elem)=>(typeof elem === 'string'))
        ){
          let id = uuidv4();
          while (db.find((user) => user.id===id)) {
            id = uuidv4();
          }
          reqBody.id = id;
          db.push(reqBody);
          sendResponse(res, 201, reqBody);
          return;
        }
        sendResponse(res, 400, 'request body does not contain required fields');
      });
    break;
    default:
      res.statusCode = 404;
      res.write(`CANNOT POST ${req.url}`);
      res.end();
  }
}