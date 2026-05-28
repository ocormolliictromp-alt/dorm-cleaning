// 每日语录库
export const QUOTES = [
  { text: "一屋不扫，何以扫天下。", author: "范晔" },
  { text: "生活不是等待风暴过去，而是学会在雨中跳舞。", author: "维维安·格林" },
  { text: "细节决定成败，习惯成就未来。", author: "佚名" },
  { text: "保持热爱，奔赴山海。", author: "佚名" },
  { text: "自律即自由。", author: "康德" },
  { text: "每天进步一点点，成功就在不远处。", author: "佚名" },
  { text: "今天的努力，是明天的底气。", author: "佚名" },
  { text: "简单的事情重复做，重复的事情用心做。", author: "佚名" },
  { text: "优秀的习惯是成功的基石。", author: "佚名" },
  { text: "干净的环境是高效学习的基础。", author: "佚名" },
  { text: "团结协作，共创温馨宿舍。", author: "佚名" },
  { text: "劳动最光荣，奉献最快乐。", author: "佚名" },
  { text: "明日复明日，明日何其多。我生待明日，万事成蹉跎。", author: "钱福" },
  { text: "千里之行，始于足下。", author: "老子" },
  { text: "天下难事，必作于易；天下大事，必作于细。", author: "老子" },
  { text: "不积跬步，无以至千里；不积小流，无以成江海。", author: "荀子" },
  { text: "锲而舍之，朽木不折；锲而不舍，金石可镂。", author: "荀子" },
  { text: "业精于勤，荒于嬉；行成于思，毁于随。", author: "韩愈" },
  { text: "书山有路勤为径，学海无涯苦作舟。", author: "韩愈" },
  { text: "宝剑锋从磨砺出，梅花香自苦寒来。", author: "佚名" },
  { text: "路漫漫其修远兮，吾将上下而求索。", author: "屈原" },
  { text: "长风破浪会有时，直挂云帆济沧海。", author: "李白" },
  { text: "天行健，君子以自强不息。", author: "周易" },
  { text: "地势坤，君子以厚德载物。", author: "周易" },
  { text: "知人者智，自知者明。", author: "老子" },
  { text: "学而不思则罔，思而不学则殆。", author: "孔子" },
  { text: "三人行，必有我师焉。", author: "孔子" },
  { text: "敏而好学，不耻下问。", author: "孔子" },
  { text: "己所不欲，勿施于人。", author: "孔子" },
  { text: "岁寒，然后知松柏之后凋也。", author: "孔子" },
  { text: "静以修身，俭以养德。", author: "诸葛亮" },
  { text: "非淡泊无以明志，非宁静无以致远。", author: "诸葛亮" },
  { text: "勿以恶小而为之，勿以善小而不为。", author: "刘备" },
  { text: "盛年不重来，一日难再晨。及时当勉励，岁月不待人。", author: "陶渊明" },
  { text: "少年易老学难成，一寸光阴不可轻。", author: "朱熹" },
  { text: "纸上得来终觉浅，绝知此事要躬行。", author: "陆游" },
  { text: "黑发不知勤学早，白首方悔读书迟。", author: "颜真卿" },
  { text: "少壮不努力，老大徒伤悲。", author: "汉乐府" },
  { text: "有志者，事竟成，破釜沉舟，百二秦关终属楚。", author: "蒲松龄" },
  { text: "苦心人，天不负，卧薪尝胆，三千越甲可吞吴。", author: "蒲松龄" }
]

// 根据日期获取每日语录（基于日期生成固定索引）
export function getDailyQuote(date = new Date()) {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
  const index = dayOfYear % QUOTES.length
  return QUOTES[index]
}

// 随机获取语录
export function getRandomQuote() {
  const index = Math.floor(Math.random() * QUOTES.length)
  return QUOTES[index]
}
