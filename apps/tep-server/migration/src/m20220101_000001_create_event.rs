use sea_orm::{EnumIter, Iterable};
use sea_orm_migration::{prelude::*, schema::*};

const EVENT_TITLE_IDX_NAME: &str = "idx-event_title";
const EVENT_STATUS_COL_NAME: &str = "event_status";

#[derive(DeriveIden, EnumIter)]
enum EventStatus {
    Draft,
    Published,
    Cancelled,
}

#[derive(DeriveIden)]
enum Event {
    Table,
    Id,
    Title,
    Description,
    Status,
    Creator,
    Organizer,
    Thumbnail,
    DateFrom,
    DateTo,
    IsArrivalTimeRequired,
    IsDepartureTimeRequired,
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
                    .table(Event::Table)
                    .if_not_exists()
                    .col(uuid(Event::Id).not_null().primary_key())
                    .col(string(Event::Title).not_null())
                    .col(string(Event::Description))
                    .col(enumeration(
                        Event::Status,
                        Alias::new(EVENT_STATUS_COL_NAME),
                        EventStatus::iter(),
                    ))
                    .col(uuid(Event::Creator).not_null())
                    .col(uuid(Event::Organizer).not_null())
                    .col(string(Event::Thumbnail))
                    .col(date_time(Event::DateFrom).not_null())
                    .col(date_time(Event::DateTo).not_null())
                    .col(
                        boolean(Event::IsArrivalTimeRequired)
                            .not_null()
                            .default(true),
                    )
                    .col(
                        boolean(Event::IsDepartureTimeRequired)
                            .not_null()
                            .default(true),
                    )
                    .col(
                        timestamp(Event::CreatedAt)
                            .default(Expr::current_timestamp())
                            .not_null(),
                    )
                    .col(
                        timestamp(Event::UpdatedAt)
                            .default(Expr::current_timestamp())
                            .not_null(),
                    )
                    .col(timestamp(Event::DeletedAt))
                    .to_owned(),
            )
            .await?;

        manager
            .create_index(
                Index::create()
                    .if_not_exists()
                    .name(EVENT_TITLE_IDX_NAME)
                    .table(Event::Table)
                    .col(Event::Title)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_index(Index::drop().name(EVENT_TITLE_IDX_NAME).to_owned())
            .await?;

        manager
            .drop_table(Table::drop().table(Event::Table).to_owned())
            .await?;

        Ok(())
    }
}
