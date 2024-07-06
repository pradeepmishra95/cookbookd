import {StyledText, StyledView} from '@/components';
import {IconNode} from '@rneui/base';
import {ListItem, ListItemProps, ThemeConsumer} from '@rneui/themed';
import {styled} from 'nativewind';
import {ReactNode} from 'react';

export type StyledListItemPropsType = ListItemProps & {
  twContainer?: Array<ListItemProps['containerStyle']>;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  rightComponent?: ReactNode;
  leftComponent?: ReactNode;
};

// Styled ListItem
const StyledListItemWrapper = ({
  twContainer,
  ...props
}: StyledListItemPropsType) => {
  return (
    <ThemeConsumer>
      {({theme}) => (
        <ListItem
          {...props}
          containerStyle={[...(twContainer ?? []), props.containerStyle]}>
          {props.leftComponent}
          <ListItem.Content>
            <ListItem.Title>
              <StyledText h4>{props.title}</StyledText>
            </ListItem.Title>
            {props.subtitle !== undefined && (
              <ListItem.Subtitle>
                <StyledText h5>{props.subtitle}</StyledText>
              </ListItem.Subtitle>
            )}
          </ListItem.Content>
          {props.rightComponent}
        </ListItem>
      )}
    </ThemeConsumer>
  );
};

const StyledListItem = styled(StyledListItemWrapper, {
  props: {
    twContainer: true,
  },
});

// Styled Accordion

export type StyledAccordionPropsType = ListItemProps & {
  twContainer?: Array<ListItemProps['containerStyle']>;
  title: string | ReactNode;
  subtitle?: string;
  rightIcon?: IconNode;
  children?: ReactNode;
  isExpanded: boolean;
};

const StyledAccordionWrapper = ({
  twContainer,
  ...props
}: StyledAccordionPropsType) => {
  return (
    <ListItem.Accordion
      {...props}
      icon={props.rightIcon}
      containerStyle={[...(twContainer ?? []), props.containerStyle]}
      isExpanded={props.isExpanded}
      content={
        <StyledView>
          <ListItem.Content>
            <ListItem.Title>
              <StyledText h4>{props.title}</StyledText>
            </ListItem.Title>
            {props.subtitle !== undefined && (
              <ListItem.Subtitle>
                <StyledText h5>{props.subtitle}</StyledText>
              </ListItem.Subtitle>
            )}
          </ListItem.Content>
        </StyledView>
      }>
      {props.children}
    </ListItem.Accordion>
  );
};

const StyledAccordion = styled(StyledAccordionWrapper, {
  props: {
    twContainer: true,
  },
});

export default StyledListItem;
export {StyledAccordion};
