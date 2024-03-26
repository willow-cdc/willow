import { ListItem, Switch, ListItemText } from "@mui/material";

interface ColumnListItemProps {
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
}: ColumnListItemProps) => {
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
