using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;
using Newtonsoft.Json;
using awillInc;

public class Main : MonoBehaviour
{
    public string address;
    public MonsterUIDisplay MonsterPrefab;
    public Transform monsterContainer;
    // Use this for initialization
    void Start()
    {
        //hit endpoint
        //get json result
        //make result into a class
        //first pass of UI for monster

        StartCoroutine(GetMonsters());
    }

    IEnumerator GetMonsters()
    {
        WWW www = new WWW(string.Format("{0}monsters?output=all", address));
        yield return www;
        //Get monsters from JSON
        Dictionary<string, List<Monster>> data = JsonConvert.DeserializeObject<Dictionary<string, List<Monster>>>(www.text);
        List<Monster> monsters;
        data.TryGetValue("monsters",out monsters);
        
        //Get errors from JSON
        // Dictionary<string, string> err = JsonConvert.DeserializeObject<Dictionary<string, string>>(www.text);
        // string errs;
        // err.TryGetValue("err",out errs);
        //Display errors here if they exist

        foreach (Monster mon in monsters)
        //Monster mon = monsters[0];
        {
            //Debug.LogFormat("Name:{0}", mon.Name);
            MonsterUIDisplay monUI = Instantiate(MonsterPrefab, Vector3.zero, Quaternion.identity, monsterContainer);
            monUI.SetMonster(mon);
        }
    }

    

    // Update is called once per frame
    void Update()
    {

    }
}
