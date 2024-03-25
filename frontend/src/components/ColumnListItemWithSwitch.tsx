import { ListItem, Switch, ListItemText } from "@mui/material";

interface TableListItemProps {
  value: string;
  selected: boolean;
  onSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  isPrimaryKey: boolean;
}

const ColumnListItemWithSwitch = ({
  value,
  selected,
  text,
  onSwitchChange,
  isPrimaryKey,
}: TableListItemProps) => {
  return (
    <ListItem
      sx={{ padding: 0 }}
      secondaryAction={
        <Switch
          disabled={isPrimaryKey}
          color="willowGreen"
          checked={selected}
          onChange={onSwitchChange}
          value={value}
          inputProps={{
            "aria-label": value,
          }}
        />
      }
    >
      <ListItemText
        sx={{ paddingLeft: 2 }}
        primary={isPrimaryKey ? `${text} - PK` : text}
      ></ListItemText>
    </ListItem>
  );
};

export default ColumnListItemWithSwitch;
