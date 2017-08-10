using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

public class MonsterManager
{
    public List<Monster> Monsters;
    public bool IsLoaded = false;
    public IEnumerator GetMonsters()
    {
        string address = "https://f2caa318.ngrok.io";
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
        Monsters = response.monsters;
        IsLoaded = true;
    }
}
