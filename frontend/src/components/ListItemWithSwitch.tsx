import { ListItem, Switch, ListItemButton, ListItemText } from "@mui/material";

interface TableListItemProps {
  value: string;
  selected: boolean;
  onSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  text: string;
  onButtonClick?: () => void;
  isFocused?: boolean;
}

const ListItemWithSwitch = ({
  value,
  selected,
  text,
  onSwitchChange,
  onButtonClick,
  isFocused,
}: TableListItemProps) => {
  return (
    <ListItem
      sx={{ padding: 0 }}
      secondaryAction={
        <Switch
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
      {onButtonClick ? (
        <ListItemButton
          selected={isFocused}
          onClick={onButtonClick}
          sx={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <ListItemText primary={text}></ListItemText>
        </ListItemButton>
      ) : (
        <ListItemText sx={{ paddingLeft: 2 }} primary={text}></ListItemText>
      )}
    </ListItem>
  );
};

export default ListItemWithSwitch;
