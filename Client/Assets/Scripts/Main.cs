using awillInc;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using UnityEngine.UI;
using System;

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
        
        StartCoroutine(LoadMonsterDisplays());
    }

    void Update()
    {
        
    }

    private void ResizeMonsterContainer()
    {
        RectTransform rect = monsterContainer.GetComponent<RectTransform>();
        int contHeight = 0;
        Debug.LogFormat("Count:{0}", MonsterManager.Instance.Monsters.Count);
        if (MonsterManager.Instance.Monsters.Count > 0)
        {
            //NOTE: The 50 is for padding at the top on the container
            contHeight = 50 + (200 * MonsterManager.Instance.Monsters.Count);
        }
        rect.sizeDelta = new Vector2(rect.sizeDelta.x, contHeight);
    }

    private IEnumerator LoadMonsterDisplays()
    {
        yield return MonsterManager.Instance.GetMonsters();
        //monsters = monsterHash as List<Monster>;
        // Monster mon = monsters[0];
        foreach (Monster mon in MonsterManager.Instance.Monsters)
        {
            MonsterUIDisplay muid = Instantiate(MonsterPrefab, Vector3.zero, Quaternion.identity, monsterContainer);
            muid.SetMonster(mon);
        }
        ResizeMonsterContainer();
    }

    public void OnMonsterSelect(Monster SelectedMonster)
    {
        ScreenManager.Instance.LoadScreen("MonsterInfo");
        ScreenManager.Instance.setCurrentMonster(SelectedMonster);
    }
}

