use sea_orm::{Database, DatabaseConnection, DbErr};
use std::env;

fn get_db_url() -> Result<String, env::VarError> {
    dotenvy::dotenv().expect("Could not load dotenv variables");

    return env::var("DATABASE_URL");
}

pub async fn get_connection() -> Result<DatabaseConnection, DbErr> {
    let database_url = get_db_url().expect("Environment variable 'DATABASE_URL' not found!");
    let connection = Database::connect(&database_url).await?;

    return Ok(connection);
}
