import React from 'react';
import TaskBySid from './components/TaskBySid/TaskBySid';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from "@twilio-paste/core/customization";

const PLUGIN_NAME = 'TeamViewFilterBySidPlugin';

export default class TeamViewFilterBySidPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   */
  async init(flex, manager) {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider
    });
    
    // Create a functional component to manage state for SideNav
    const SideNavWithState = (props) => {
      return (
        <flex.SideLink
          key="view-by-sid"
          showLabel={true}
          icon="Directory"
          iconActive="DirectoryBold"
          isActive={props.activeView === "view-by-sid"}
          onClick={() => {
            flex.Actions.invokeAction("NavigateToView", {
              viewName: "view-by-sid"
            })
          }}
        >
          tasksBySids
        </flex.SideLink>
      )
    }

    flex.SideNav.Content.add(
      <SideNavWithState key="task-by-sid" />,
      { sortOrder: 2 }
    );

    flex.ViewCollection.Content.add(
      <flex.View name="view-by-sid" key="view-by-sid">
        <TaskBySid />
      </flex.View>
    );
  }
}
