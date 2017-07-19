using Newtonsoft.Json;

public class Monster {

    [JsonProperty(PropertyName = "id")]
    public string id;
	[JsonProperty(PropertyName = "name")]
    public string Name;
    [JsonProperty(PropertyName = "type")]
    public string type;
    [JsonProperty(PropertyName = "isLegendary")]
    public bool isLegendary;
    [JsonProperty(PropertyName = "star_level")]
    public int star_level;
    [JsonProperty(PropertyName = "image_base")]
    public string image_base;
    [JsonProperty(PropertyName = "image_awakened")]
    public string image_awakened;
    [JsonProperty(PropertyName = "level")]
    public int level;
    [JsonProperty(PropertyName = "base_hp")]
    public int base_hp;
    [JsonProperty(PropertyName = "base_attack")]
    public int base_attack;
    [JsonProperty(PropertyName = "base_speed")]
    public int base_speed;
    [JsonProperty(PropertyName = "base_defense")]
    public int base_defense;
    [JsonProperty(PropertyName = "base_crit_rate")]
    public int base_crit_rate;
    [JsonProperty(PropertyName = "base_crit_damage")]
    public int base_crit_damage;
    [JsonProperty(PropertyName = "base_resistance")]
    public int base_resistance;
    [JsonProperty(PropertyName = "base_accuracy")]
    public int base_accuracy;

    // "id": 30,
    //   "name": "Mei",
    //   "type": "fire",
    //   "isLegendary": false,
    //   "star_level": 3,
    //   "image_base": "http://vignette1.wikia.nocookie.net/summoners-war-sky-arena/images/d/d2/Martial_Cat_%28Fire%29_Icon.png/revision/latest/scale-to-width-down/100?cb=20141213075143",
    //   "image_awakened": "http://vignette1.wikia.nocookie.net/summoners-war-sky-arena/images/a/a4/Mei_Icon.png/revision/latest/scale-to-width-down/100?cb=20141213075242",
    //   "level": 40,
    //   "base_hp": 8240,
    //   "base_attack": 747,
    //   "base_defense": 515,
    //   "base_speed": 104,
    //   "base_crit_rate": 15,
    //   "base_crit_damage": 50,
    //   "base_resistance": 40,
    //   "base_accuracy": 0
}
