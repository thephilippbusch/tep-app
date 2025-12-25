use sea_orm_migration::{prelude::*, schema::*};

const VENUE_TITLE_IDX_NAME: &str = "idx-venue_title";

#[derive(DeriveIden)]
enum Venue {
    Table,
    Id,
    Title,
    Description,
    Host,
    CoHosts,
    IsExternal,
    Street,
    City,
    Postal,
    State,
    Country,
    CreatedAt,
    UpdatedAt,
    DeletedAt,
}

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Venue::Table)
                    .if_not_exists()
                    .col(uuid(Venue::Id).not_null().primary_key())
                    .col(string(Venue::Title).not_null())
                    .col(string(Venue::Description))
                    .col(uuid(Venue::Host).not_null())
                    .col(array(Venue::CoHosts, ColumnType::Uuid).not_null())
                    .col(boolean(Venue::IsExternal).default(false).not_null())
                    .col(string(Venue::Street).not_null())
                    .col(string(Venue::City).not_null())
                    .col(string(Venue::Postal).not_null())
                    .col(string(Venue::State).not_null())
                    .col(string(Venue::Country).not_null())
                    .col(
                        timestamp(Venue::CreatedAt)
                            .default(Expr::current_timestamp())
                            .not_null(),
                    )
                    .col(
                        timestamp(Venue::UpdatedAt)
                            .default(Expr::current_timestamp())
                            .not_null(),
                    )
                    .col(timestamp(Venue::DeletedAt))
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .if_not_exists()
                    .name(VENUE_TITLE_IDX_NAME)
                    .table(Venue::Table)
                    .col(Venue::Title)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_index(Index::drop().name(VENUE_TITLE_IDX_NAME).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(Venue::Table).to_owned())
            .await?;

        Ok(())
    }
}
