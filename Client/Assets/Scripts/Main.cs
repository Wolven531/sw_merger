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
    private MonsterManager monsterManager;

    void Start()
    {
        monsterManager = new MonsterManager();
        // NOTE: approach:
        // 1) hit endpoint
        // 2) get json result
        // 3) make result into a class
        // 4) first pass of UI for monster
        StartCoroutine(monsterManager.GetMonsters());
        StartCoroutine(LoadMonsterDisplays());
    }

    void Update()
    {
        RectTransform rect = monsterContainer.GetComponent<RectTransform>();
        //NOTE: The 50 is for padding at the top on the container
        int contHeight = 50 + (200 * monsterManager.Monsters.Count);
        rect.sizeDelta = new Vector2(rect.sizeDelta.x, contHeight);
    }

    private IEnumerator LoadMonsterDisplays()
    {
        while (!monsterManager.IsLoaded)
        {
            yield return new WaitForSeconds(1);
        }
        //monsters = monsterHash as List<Monster>;
        // Monster mon = monsters[0];
        foreach (Monster mon in monsterManager.Monsters)
        {
            MonsterUIDisplay muid = Instantiate(MonsterPrefab, Vector3.zero, Quaternion.identity, monsterContainer);
            muid.SetMonster(mon);
        }
    }

    public void OnMonsterSelect()
    {
        ScreenManager.Instance.LoadScreen("MonsterInfo");
    }
}

