import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";


class my_typeOrm{
    static creatType(config:ConfigService):TypeOrmModuleOptions{
        return {
            type:'postgres',
            host:config.get('POSTGRES_HOST'),
            port:parseInt(config.get('POSTGRES_PORT')),
            username:config.get('POSTGRES_USER'),
            password:config.get('POSTGRES_PASSWORD'),
            database:config.get('POSTGRES_DB'),
            retryAttempts:3,
            autoLoadEntities:true,
            synchronize: true,
            entities:[__dirname + '/**/*.entity{.js, .ts}'],

        };
    }
}


export const DataService : TypeOrmModuleAsyncOptions={
   
   useFactory:async (config:ConfigService) => my_typeOrm.creatType(config),
   inject: [ConfigService],
}