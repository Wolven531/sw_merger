using System.Collections;
using System.Collections.Generic;
using Newtonsoft.Json;
using UnityEngine;

public class MonsterManager
{
    private static MonsterManager _instance;
    public List<Monster> Monsters = new List<Monster>();
    public bool IsLoaded = false;

    public static MonsterManager Instance { 
		get { 
			if (_instance == null) {
                _instance = new MonsterManager();
			}
			return _instance;
		}
	}

    public IEnumerator GetMonsters()
    {
        string address = "https://a3e0e0b3.ngrok.io";
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
        Debug.LogFormat("Monsters in Manager: {0}", Monsters.Count);
        IsLoaded = true;
    }
}
