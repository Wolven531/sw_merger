using awillInc;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;

public class Main : MonoBehaviour
{
    public MonsterUIDisplay MonsterPrefab;
    public Transform monsterContainer;

    void Start()
    {
        // NOTE: approach:
        // 1) hit endpoint
        // 2) get json result
        // 3) make result into a class
        // 4) first pass of UI for monster
        StartCoroutine(GetMonsters());
    }

    IEnumerator GetMonsters()
    {
        string address = "https://6fe2dbe5.ngrok.io";
        WWW www = new WWW(string.Format("{0}/monsters?output=all", address));
        yield return www;

        // NOTE: bail out if there was an error
        if (!string.IsNullOrEmpty(www.error))
        {

            yield return null;
        }
        APIMonsterResponse response = new APIMonsterResponse();
        //JsonConvert.DeserializeAnonymousType<APIMonsterResponse>(www.text, response);
        response = JsonConvert.DeserializeObject<APIMonsterResponse>(www.text);
        // NOTE: Get monsters from JSON
        //Dictionary<string, List<Monster>> data = JsonConvert.DeserializeObject<Dictionary<string, List<Monster>>>(www.text);

        //monsters = monsterHash as List<Monster>;
        // Monster mon = monsters[0];
        foreach (Monster mon in response.monsters)
        {
            MonsterUIDisplay muid = Instantiate(MonsterPrefab, Vector3.zero, Quaternion.identity, monsterContainer);
            muid.SetMonster(mon);
        }
    }
}

class APIMonsterResponse
{
    [JsonProperty(PropertyName = "monsters")]
    public List<Monster> monsters = new List<Monster>();
    [JsonProperty(PropertyName = "err")]
    public string err = string.Empty;

}
