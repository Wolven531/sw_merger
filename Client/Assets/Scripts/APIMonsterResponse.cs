using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

public class APIMonsterResponse{

    [JsonProperty(PropertyName = "monsters")]
    public List<Monster> monsters = new List<Monster>();
    [JsonProperty(PropertyName = "err")]
    public string err = string.Empty;
}
