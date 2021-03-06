import { Message } from 'discord.js';
import { prefixedCommandRuleTemplate } from '../../config';
import { Command, CommandClass, detectStaff, helpChannelService, guildService } from '../../shared';

@Command({
  matches: ['done'],
  ...prefixedCommandRuleTemplate
})
export class DoneCommand implements CommandClass {
  /**
   * Marks a help channel as no longer read-only
   * @param msg Original discord message
   * @param args Message contents, split on space character
   */
  action(msg: Message, args: string[]) {
    helpChannelService.markNotBusy(msg.channel.id);

    if (!!~args.indexOf('silent') || !!~args.indexOf('s')) return;

    const sirQuackers = guildService.guild.emojis.find('name', 'duckycode').toString();
    msg.channel.send(`This channel is now available for another question ${sirQuackers}`);
  }

  /**
   * Command validation action
   * @param msg Original discord message
   * @param args Message contents, split on space character
   */
  pre(msg: Message, args: string[]) {
    const helpChannelController = helpChannelService.helpChannels.find(controller => controller.id === msg.channel.id);
    return !!detectStaff(msg.member) || (helpChannelController !== undefined && helpChannelController.culprit === msg.author.id);
  }
}
