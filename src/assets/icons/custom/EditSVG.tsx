import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
const SvgComponent = (props: SvgProps) => (
  <Svg width={30} height={30} fill="none" {...props}>
    <Path
      fill="currentColor"
      d="M4.615 16.27c-.508 0-.983-.175-1.325-.5-.433-.409-.642-1.025-.567-1.692l.309-2.7c.058-.508.366-1.184.725-1.55l6.841-7.242c1.709-1.808 3.492-1.858 5.3-.15 1.809 1.709 1.859 3.492.15 5.3l-6.841 7.242c-.35.375-1 .725-1.509.808l-2.683.458c-.142.009-.267.026-.4.026Zm8.658-13.842c-.641 0-1.2.4-1.766 1l-6.842 7.25c-.167.175-.358.592-.392.833l-.308 2.7c-.033.275.033.5.183.642.15.142.375.191.65.15l2.684-.458c.241-.042.641-.259.808-.434l6.842-7.241c1.033-1.1 1.408-2.117-.1-3.534-.667-.641-1.242-.908-1.759-.908Z"
    />
    <Path
      fill="currentColor"
      d="M14.447 9.127h-.058A5.716 5.716 0 0 1 9.297 4.31a.635.635 0 0 1 .525-.716.635.635 0 0 1 .717.525 4.477 4.477 0 0 0 3.983 3.766.626.626 0 0 1 .558.684.645.645 0 0 1-.633.558ZM17.5 18.958h-15a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625h15a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625Z"
    />
  </Svg>
);
export default SvgComponent;
