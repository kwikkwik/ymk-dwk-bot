const db = require('./database').feed;
const req = require('request-promise-native');
const { load } = require('cheerio');

class feed {
  static async animefeed(){
    const body = await req({url:'https://www.animenewsnetwork.com/newsfeed/rss.xml'});
    const $ = load(body, {xmlMode: true});
    const raw = $('item').first();
    let obj = {
    title: raw.find('title').text(),
    link: raw.find('link').text(),
    description: raw.find('description').text().replace(/<cite>/gi, '').replace(/<\/cite>/gi, ''),
    pubDate: raw.find('pubDate').text(),
    category: [],
    channel: db.getProp('anime', 'channel')
    };
    
    raw.find('category').each((i,el) => obj.category[i] = '`' + $(el).text() + '`');
    
    if(db.getProp('anime', 'pubDate') === obj.pubDate) return undefined;
    db.setProp('anime', 'pubDate', obj.pubDate);
    return obj;
  }
  static async mcnetfeed(){
    const body = await req({url:'https://minecraft.net/en-us/feeds/community-content/rss'});
    const $ = load(body, {xmlMode: true})('item').first();
    let obj = {
      title: $.find('title').text(),
      link: $.find('link').text(),
      description: $.find('description').text(),
      pubDate: $.find('pubDate').text(),
      channel: db.getProp('mcnet', 'channel'),
      image: undefined
    };
    if(db.getProp('mcnet', 'pubDate') === obj.pubDate) return undefined;
    db.setProp('mcnet', 'pubDate', obj.pubDate);
    const image = await req({url:obj.link});
    obj.image = load(image)('meta[property=og\\:image]').attr('content');
    return obj;
  }
}

module.exports = feed;