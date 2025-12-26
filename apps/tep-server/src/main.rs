extern crate dotenvy;
extern crate sea_orm;

mod utils;

use utils::db;

#[tokio::main]
async fn main() {
    let connection = db::get_connection().await.unwrap();

    connection.ping().await.unwrap();
}
