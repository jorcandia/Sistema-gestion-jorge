to generate migrations from entities after checking database tables, e.g.: migration_name=create_users_table yarn migration:generate
    $ yarn migration:generate --name={FILE_NAME} 
to run migrations
    $ yarn migration:run
to revert last migration
    $ yarn migration:revert
to create custom-migration like insert data
    $ yarn migration:create --name={FILE_NAME} 