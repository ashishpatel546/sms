import { INestApplication} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


export function setUpSwagger(app: INestApplication){
    const docBuilder = new DocumentBuilder()
    .setTitle('School Management System')
    .addTag("")
    .setDescription("API Calls for School Management System");

    
    
     docBuilder.addBearerAuth(
       {
         description: 'Please add the token in following format : <jwt_token>',
         name: 'Authorization',
         bearerFormat: 'Bearer',
         scheme: 'Bearer',
         type: 'http',
         in: 'Header',
       },
       'access-token',
     );

     const document = SwaggerModule.createDocument(app,docBuilder.build());
     SwaggerModule.setup('documentation', app, document, {
       swaggerOptions: {
         persistAuthorization: true,
       },
     });
}

