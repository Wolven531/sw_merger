using System.Collections;
using System.Collections.Generic;
using awillInc;
using UnityEngine;
using UnityEngine.UI;

public class MonsterUIDisplay : MonoBehaviour
{
    public Monster monster;
    public Text MonsterName;
    ImgDisp ImageBase;
    ImgDisp ImageAwakened;
	public ImgDisp IMG_PREFAB;
	public Transform ImgContainer;

    // Use this for initialization
    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }

    public void SetMonster(Monster mon)
    {
        this.monster = mon;

        MonsterSetup();
    }

    public void MonsterSetup()
    {
        //Debug.LogFormat("after cont Name:{0}", this.monster.Name);
        MonsterName.text = monster.Name;
        //StartCoroutine(GetImage(monster.image_base, ImageBase));
		ImageBase = Instantiate(IMG_PREFAB, Vector3.zero, Quaternion.identity, ImgContainer);
		ImgDisp.loadSpriteToObject(monster.image_base, ImageBase, string.Format("{0}_{1}_b.png", monster.type, monster.Name));
        //StartCoroutine(GetImage(monster.image_awakened, ImageAwakened));
		ImageAwakened = Instantiate(IMG_PREFAB, Vector3.zero, Quaternion.identity, ImgContainer);
		ImgDisp.loadSpriteToObject(monster.image_awakened, ImageAwakened, string.Format("{0}_{1}_a.png", monster.type, monster.Name));
    }
}
