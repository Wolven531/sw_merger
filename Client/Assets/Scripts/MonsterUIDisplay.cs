using awillInc;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class MonsterUIDisplay : MonoBehaviour
{
    public ImgDisp IMG_PREFAB;

    [SerializeField] Monster monster;
    [SerializeField] GameObject nameDisp;
    [SerializeField] Text nameText;
    [SerializeField] Transform ImgContainer;
    [SerializeField] ImgDisp ImageBase;
    [SerializeField] ImgDisp ImageAwakened;

    void Start()
    {
        // NOTE: bail out if monster is null
        if (this.monster == null)
        {
            Debug.LogWarningFormat("monster was null, bailing...");
            return;
        }

        nameText.text = this.monster.Name;
        nameText.gameObject.SetActive(true);

        ImgDisp.loadSpriteToObject(
            monster.image_base,
            ImageBase,
            string.Format(
                "{0}_{1}_b.png",
                monster.type,
                monster.Name
            )
        );

        ImgDisp.loadSpriteToObject(
            monster.image_awakened,
            ImageAwakened,
            string.Format(
                "{0}_{1}_a.png",
                monster.type,
                monster.Name
            )
        );
    }

    public void SetMonster(Monster mon)
    {
        this.monster = mon;
    }

    public void onClicked(){
        ScreenManager.Instance.GoToMonsterScreen(monster);
    }
}
