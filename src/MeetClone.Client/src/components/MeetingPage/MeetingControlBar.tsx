import { MeetingControlBarStyled } from "./MeetingControlBar.styled";
import { Button } from "../styles/Button.styled";

type Props = {
  onLeave: () => void;
};

function MeetingControlBar({ onLeave }: Props) {
  return (
    <MeetingControlBarStyled>
      <Button color="red" onClick={onLeave}>
        Leave
      </Button>
      <Button>Share Camera</Button>
    </MeetingControlBarStyled>
  );
}

export default MeetingControlBar;
