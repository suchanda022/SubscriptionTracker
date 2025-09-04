const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const options  = {
    definition:{
        openapi: "3.0.0",
        info:{
            title:"subscription tracker API",
            version: "1.0.0",
            description:"API documentation for subscription tracker project"

        },
        servers:[
            {
                url: "http://localhost:3000/api",
            },
        ],
        components: {
         securitySchemes: {
         bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
    
    apis:["./routes/*.js","./controller/*js"],   // path to  your route files
};

const swaggerSpec = swaggerJsDoc(options);

function swaggerDocs(app){
    app.use("/api-docs", swaggerUi.serve,swaggerUi.setup(swaggerSpec));
}
module.exports = swaggerDocs;