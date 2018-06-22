import { IConfig, IPluginDestinationMap } from '@testring/typings';
import { PluginController } from './plugin-controller';

export * from './plugin-finder';

export const applyPlugins = (pluginsDestinations: IPluginDestinationMap, config: IConfig) => {
    const controller = new PluginController(pluginsDestinations);

    controller.initialize(config.plugins);
};
