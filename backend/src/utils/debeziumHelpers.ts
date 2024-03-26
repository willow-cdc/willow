import shortUuid from 'short-uuid';
import { FinalSourceRequestBody } from '../routes/types/sourceRoutesTypes';
import { DebeziumConfig } from './types/debeziumHelpersTypes';

const addTablesAndColumnsToConfig = (source: FinalSourceRequestBody, config: DebeziumConfig) => {
  const selectedTables = source.formData.filter((table) => table.selected);

  const includedTables: string[] = [];
  const includedColumns: string[] = [];

  selectedTables.forEach((table) => {
    const selectedColumns = table.columns.filter((column) => column.selected).map((column) => column.dbzColumnValue);

    if (selectedColumns.length > 0) {
      includedTables.push(table.dbzTableValue);
      includedColumns.push(...selectedColumns);
    }
  });

  if (includedTables.length > 0) {
    config['table.include.list'] = includedTables.join(',');
    config['column.include.list'] = includedColumns.join(',');
  }
};

const ALLOWED_SLOT_NAME_CHARACTERS = '0123456789abcdefghijkmnopqrstuvwxyz_';

export const setupConnectorPayload = (source: FinalSourceRequestBody) => {
  const uuid = shortUuid(ALLOWED_SLOT_NAME_CHARACTERS).generate();
  const connectorObj = {
    name: source.connectionName,
    config: {
      'plugin.name': 'pgoutput',
      'connector.class': 'io.debezium.connector.postgresql.PostgresConnector',
      'tasks.max': '1',
      'database.hostname': source.host,
      'database.port': source.port,
      'database.user': source.user,
      'database.password': source.password,
      'database.dbname': source.dbName,
      'topic.prefix': source.connectionName,
      'skipped.operations': 'none',
      'decimal.handling.mode': 'double',
      'publication.name': 'willow_publication',
      'slot.name': `willow_${uuid}`,
      'publication.autocreate.mode': 'filtered',
    },
  };

  if (source.formData.length > 0) {
    addTablesAndColumnsToConfig(source, connectorObj.config);
  }

  return connectorObj;
};