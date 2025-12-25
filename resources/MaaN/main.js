window.addEventListener('dragover', (event) => {event.preventDefault()})
window.addEventListener('drop', (event) => {event.preventDefault()})
window.addEventListener('contextmenu', (event) => {event.preventDefault()})

const MaaN = (() => {

const MaaN = {}

MaaN.locales = ['en-us', 'ja-jp', 'ko-kr', 'zh-cn', 'zh-tw']

MaaN.defaultTasks = 'farming'

MaaN.clientTypes = ["Official", "Bilibili", "YoStarEN", "YoStarJP", "YoStarKR", "txwy"]
MaaN.globalResources = ["YoStarEN", "YoStarJP", "YoStarKR", "txwy"]

MaaN.loggedTasks = ['operbox', 'depot']
MaaN.operBoxData = null
MaaN.depotData = null

MaaN.locked = true

MaaN.cliPath = null
MaaN.coreVersion = null

MaaN.screen = 'Farming'
MaaN.logMode = null

MaaN.paths = {}
MaaN.operatorData = {
    'chars': {},
    'ranges': {}
}

MaaN.route = {
    'Farming': [],
    'Copilot': [],
    'Toolbox': [],
    'Settings': []
}

MaaN.instanceConfigPath = 'maan.config.json'

MaaN.config = {
    profile: 'MaaN',
    schedules: [
        {
            cron: '00 00 * * *',
            enabled: false,
            force: false,
            profile: undefined,
            system: undefined
        }
    ],
    ui: {
        tray: true,
        system_notification: true,
        title_bar: {
            title: false,
            core_version: true,
            profile: false,
            event: true,
            connection_preset: false,
            connection_address: true,
            client_type: true
        },
        language: null,
        language_operator_name: true,
        theme: 'auto',
        amoled_dark: false,
        time_format: 'HH:mm:ss'
    },
    update: {
        check_on_start: true,
        check_on_time: false,
        auto_update: false,
        always_use_github: false,
        channel: 'stable'
    },
    profiles: {
        MaaN: {
            post_actions: {
                client: 'DoNothing',
                self: 'DoNothing',
                os: 'DoNothing',
                only_once: false
            },
            scripts: {
                pre: '',
                post: '',
                on_copilot: false,
                on_manual_stop: false
            },
            startup: {
                emulator_path: '',
                emulator_arguments: '',
                run_tasks: false,
                run_emulator: false,
                retry_emulator: false,
                wait_for_emulator: false,
                delay: 30
            },
            timeout: {
                duration: 120,
                repeat: 30
            }
        }
    }
}

MaaN.emptyConfigProfile = {
    startup: {
        delay: 30
    },
    timeout: {
        duration: 120,
        repeat: 30
    }
}

MaaN.profile = {
    connection: {
        adb_path: 'adb',
        address: null,
        config: "General",
        preset: 'ADB'
    },
    resource: {
        global_resource: undefined,
        platform_diff_resource: undefined,
        user_resource: false
    },
    static_options: {
        cpu_ocr: true,
        gpu_ocr: undefined
    },
    instance_options: {
        adb_lite_enabled: false,
        deployment_with_pause: false,
        kill_adb_on_exit: false,
        touch_mode: 'MiniTouch'
    }
}

MaaN.tasks = {
    "farming": {
        "tasks": [
            {
                "name": "StartUp",
                "type": "StartUp",
                "params": {
                    "enable": false,
                    "client_type": null,
                    "start_game_enabled": true
                }
            },
            {
                "name": "Recruit",
                "type": "Recruit",
                "params": {
                    "enable": false,
                    "refresh": true,
                    "select": [3, 4, 5, 6],
                    "confirm": [3, 4],
                    "first_tags": [],
                    "extra_tags_mode": 0,
                    "times": 4,
                    "set_time": true,
                    "expedite": false,
                    "expedite_times": 0x7FFFFFFF,
                    "skip_robot": true,
                    "recruitment_time": {
                        "3": 540,
                        "4": 540,
                        "5": 540,
                        "6": 540
                    },
                    "report_to_penguin": false,
                    "penguin_id": undefined,
                    "report_to_yituliu": false,
                    "yituliu_id": undefined,
                    "server": undefined
                }
            },
            {
                "name": "Infrast",
                "type": "Infrast",
                "params": {
                    "enable": false,
                    "refresh": true,
                    "mode": 0,
                    "facility": [
                        "Mfg",
                        "Trade",
                        "Control",
                        "Power",
                        "Reception",
                        "Office",
                        "Dorm",
                        "Processing",
                        "Training"
                    ],
                    "drones": "Money",
                    "threshold": 0.3,
                    "replenish": false,
                    "dorm_notstationed_enabled": false,
                    "dorm_trust_enabled": false,
                    "reception_message_board": true,
                    "reception_clue_exchange": true,
                    "filename": undefined,
                    "plan_index": undefined
                }
            },
            {
                "name": "Fight",
                "type": "Fight",
                "params": {
                    "enable": false,
                    "stage": undefined,
                    "medicine": 0,
                    "expiring_medicine": 0,
                    "stone": 0,
                    "times": 0x7FFFFFFF,
                    "series": 0,
                    "drops": undefined,
                    "report_to_penguin": false,
                    "penguin_id": undefined,
                    "server": undefined,
                    "client_type": null,
                    "DrGrandet": false
                }
            },
            {
                "name": "Mall",
                "type": "Mall",
                "params": {
                    "enable": false,
                    "visit_friends": true,
                    "shopping": true,
                    "buy_first": [
                        "招聘许可"
                    ],
                    "blacklist": [
                        "碳",
                        "家具",
                        "加急许可"
                    ],
                    "force_shopping_if_credit_full": true,
                    "only_buy_discount": false,
                    "reserve_max_credit": false,
                    "credit_fight": false,
                    "formation_index": 0
                }
            },
            {
                "name": "Award",
                "type": "Award",
                "params": {
                    "enable": false,
                    "award": true,
                    "mail": false,
                    "recruit": false,
                    "orundum": false,
                    "mining": false,
                    "specialaccess": false
                }
            },
            {
                "name": "Roguelike",
                "type": "Roguelike",
                "params": {
                    "enable": false,
                    "theme": "Phantom",
                    "mode": 0,
                    "squad": "指挥分队",
                    "roles": "取长补短",
                    "core_char": undefined,
                    "use_support": false,
                    "use_nonfriend_support": false,
                    "starts_count": 0x7FFFFFFF,
                    "difficulty": 0,
                    "stop_at_final_boss": false,
                    "stop_at_max_level": false,
                    "investment_enabled": true,
                    "investments_count": 0x7FFFFFFF,
                    "stop_when_investment_full": false,
                    "investment_with_more_score": false,
                    "start_with_elite_two": false,
                    "only_start_with_elite_two": false,
                    "refresh_trader_with_dice": false,
                    "first_floor_foldartal": undefined,
                    "start_foldartal_list": undefined,
                    "collectible_mode_start_list": {
                        "hot_water": false,
                        "shield": false,
                        "ingot": false,
                        "hope": false,
                        "random": false,
                        "key": false,
                        "dice": false,
                        "ideas": false
                    },
                    "use_foldartal": undefined,
                    "check_collapsal_paradigms": undefined,
                    "double_check_collapsal_paradigms": undefined,
                    "expected_collapsal_paradigms": ["目空一些", "睁眼瞎", "图像损坏", "一抹黑"],
                    "monthly_squad_auto_iterate": undefined,
                    "monthly_squad_check_comms": undefined,
                    "deep_exploration_auto_iterate": undefined,
                    "collectible_mode_shopping": false,
                    "collectible_mode_squad": undefined,
                    "collectible_mode_start_list": {
                        "hot_water": false,
                        "shield": false,
                        "ingot": false,
                        "hope": false,
                        "random": false,
                        "key": false,
                        "dice": false,
                        "ideas": false
                    },
                    "start_with_seed": undefined
                }
            },
            {
                "name": "Reclamation",
                "type": "Reclamation",
                "params": {
                    "enable": false,
                    "theme": "Tales",
                    "mode": 0,
                    "tools_to_craft": ["荧光棒"],
                    "increment_mode": 0,
                    "num_craft_batches": 16
                }
            },
            {
                "name": "CloseDown",
                "type": "CloseDown",
                "params": {
                    "enable": false,
                    "client_type": null
                }
            }
        ]
    },
    "copilot": {
        "tasks": [
            {
                "name": "Copilot",
                "type": "Copilot",
                "params": {
                    "enable": true,
                    "filename": undefined,
                    "copilot_list": undefined,
                    "loop_times": 1,
                    "use_sanity_potion": false,
                    "formation": false,
                    "formation_index": 0,
                    "user_additional": undefined,
                    "add_trust": false,
                    "ignore_requirements": false,
                    "support_unit_usage": 0,
                    "support_unit_name": undefined
                }
            }
        ]
    },
    "ssscopilot": {
        "tasks": [
            {
                "name": "SSSCopilot",
                "type": "SSSCopilot",
                "params": {
                    "enable": true,
                    "filename": undefined,
                    "loop_times": 1
                }
            }
        ]
    },
    "depot": {
        "tasks": [
            {
                "name": "Depot",
                "type": "Depot",
                "params": {
                    "enable": true
                }
            }
        ]
    },
    "operbox": {
        "tasks": [
            {
                "name": "OperBox",
                "type": "OperBox",
                "params": {
                    "enable": true
                }
            }
        ]
    }
}

MaaN.roguelikeData = {
    "Phantom": {
        "difficulty": 15,
        "modes": [
            {name: "RoguelikeStrategyExp", value: 0},
            {name: "RoguelikeStrategyGold", value: 1},
            {name: "RoguelikeStrategyLastReward", value: 4},
            {name: "RoguelikeStrategyMonthlySquad", value: 6},
            {name: "RoguelikeStrategyDeepExploration", value: 7}
        ],
        "roles": [
            {name: "FirstMoveAdvantage", value: "先手必胜"},
            {name: "SlowAndSteadyWinsTheRace", value: "稳扎稳打"},
            {name: "OvercomingYourWeaknesses", value: "取长补短"},
            {name: "AsYourHeartDesires", value: "随心所欲"}
        ],
        "squads": [
            {name: "GatheringSquad", value: "集群分队"},
            {name: "SpearheadSquad", value: "矛头分队"},
            {name: "ResearchSquad", value: "研究分队"},
            {name: "LeaderSquad", value: "指挥分队"},
            {name: "SupportSquad", value: "后勤分队"},
            {name: "TacticalAssaultOperative", value: "突击战术分队"},
            {name: "TacticalFortificationOperative", value: "堡垒战术分队"},
            {name: "TacticalRangedOperative", value: "远程战术分队"},
            {name: "TacticalDestructionOperative", value: "破坏战术分队"},
            {name: "First-ClassSquad", value: "高规格分队"}
        ]
    },
    "Mizuki": {
        "difficulty": 18,
        "modes": [
            {name: "RoguelikeStrategyExp", value: 0},
            {name: "RoguelikeStrategyGold", value: 1},
            {name: "RoguelikeStrategyLastReward", value: 4},
            {name: "RoguelikeStrategyMonthlySquad", value: 6},
            {name: "RoguelikeStrategyDeepExploration", value: 7}
        ],
        "roles": [
            {name: "FirstMoveAdvantage", value: "先手必胜"},
            {name: "SlowAndSteadyWinsTheRace", value: "稳扎稳打"},
            {name: "OvercomingYourWeaknesses", value: "取长补短"},
            {name: "AsYourHeartDesires", value: "随心所欲"}
        ],
        "squads": [
            {name: "GatheringSquad", value: "集群分队"},
            {name: "SpearheadSquad", value: "矛头分队"},
            {name: "IS2NewSquad1", value: "心胜于物分队"},
            {name: "IS2NewSquad2", value: "物尽其用分队"},
            {name: "IS2NewSquad3", value: "以人为本分队"},
            {name: "ResearchSquad", value: "研究分队"},
            {name: "LeaderSquad", value: "指挥分队"},
            {name: "SupportSquad", value: "后勤分队"},
            {name: "TacticalAssaultOperative", value: "突击战术分队"},
            {name: "TacticalFortificationOperative", value: "堡垒战术分队"},
            {name: "TacticalRangedOperative", value: "远程战术分队"},
            {name: "TacticalDestructionOperative", value: "破坏战术分队"},
            {name: "First-ClassSquad", value: "高规格分队"}
        ]
    },
    "Sami": {
        "difficulty": 15,
        "modes": [
            {name: "RoguelikeStrategyExp", value: 0},
            {name: "RoguelikeStrategyGold", value: 1},
            {name: "RoguelikeStrategyLastReward", value: 4},
            {name: "RoguelikeStrategyMonthlySquad", value: 6},
            {name: "RoguelikeStrategyDeepExploration", value: 7},
            {name: "RoguelikeStrategyCollapse", value: 5}
        ],
        "roles": [
            {name: "FirstMoveAdvantage", value: "先手必胜"},
            {name: "SlowAndSteadyWinsTheRace", value: "稳扎稳打"},
            {name: "OvercomingYourWeaknesses", value: "取长补短"},
            {name: "AsYourHeartDesires", value: "随心所欲"}
        ],
        "squads": [
            {name: "GatheringSquad", value: "集群分队"},
            {name: "SpearheadSquad", value: "矛头分队"},
            {name: "IS3NewSquad1", value: "永恒狩猎分队"},
            {name: "IS3NewSquad2", value: "生活至上分队"},
            {name: "IS3NewSquad3", value: "科学主义分队"},
            {name: "IS3NewSquad4", value: "特训分队"},
            {name: "LeaderSquad", value: "指挥分队"},
            {name: "SupportSquad", value: "后勤分队"},
            {name: "TacticalAssaultOperative", value: "突击战术分队"},
            {name: "TacticalFortificationOperative", value: "堡垒战术分队"},
            {name: "TacticalRangedOperative", value: "远程战术分队"},
            {name: "TacticalDestructionOperative", value: "破坏战术分队"},
            {name: "First-ClassSquad", value: "高规格分队"}
        ]
    },
    "Sarkaz": {
        "difficulty": 18,
        "modes": [
            {name: "RoguelikeStrategyExp", value: 0},
            {name: "RoguelikeStrategyGold", value: 1},
            {name: "RoguelikeStrategyLastReward", value: 4},
            {name: "RoguelikeStrategyMonthlySquad", value: 6},
            {name: "RoguelikeStrategyDeepExploration", value: 7}
        ],
        "roles": [
            {name: "FirstMoveAdvantage", value: "先手必胜"},
            {name: "SlowAndSteadyWinsTheRace", value: "稳扎稳打"},
            {name: "OvercomingYourWeaknesses", value: "取长补短"},
            {name: "AsYourHeartDesires", value: "随心所欲"}
        ],
        "squads": [
            {name: "GatheringSquad", value: "集群分队"},
            {name: "SpearheadSquad", value: "矛头分队"},
            {name: "IS4NewSquad1", value: "魂灵护送分队"},
            {name: "IS4NewSquad2", value: "博闻广记分队"},
            {name: "IS4NewSquad3", value: "蓝图测绘分队"},
            {name: "IS4NewSquad4", value: "因地制宜分队"},
            {name: "IS4NewSquad5", value: "异想天开分队"},
            {name: "IS4NewSquad6", value: "点刺成锭分队"},
            {name: "IS4NewSquad7", value: "拟态学者分队"},
            {name: "IS4NewSquad8", value: "专业人士分队"},
            {name: "LeaderSquad", value: "指挥分队"},
            {name: "SupportSquad", value: "后勤分队"},
            {name: "TacticalAssaultOperative", value: "突击战术分队"},
            {name: "TacticalFortificationOperative", value: "堡垒战术分队"},
            {name: "TacticalRangedOperative", value: "远程战术分队"},
            {name: "TacticalDestructionOperative", value: "破坏战术分队"},
            {name: "First-ClassSquad", value: "高规格分队"}
        ]
    },
    "JieGarden": {
        "difficulty": 15,
        "modes": [
            {name: "RoguelikeStrategyExp", value: 0},
            {name: "RoguelikeStrategyGold", value: 1},
            {name: "RoguelikeStrategyLastReward", value: 4},
            // {name: "RoguelikeStrategyFindPlaytime", value: 20001}
        ],
        "roles": [
            {name: "FirstMoveAdvantage", value: "先手必胜"},
            {name: "SlowAndSteadyWinsTheRace", value: "稳扎稳打"},
            {name: "OvercomingYourWeaknesses", value: "取长补短"},
            {name: "FlexibleDeployment", value: "灵活部署"},
            {name: "Unbreakable", value: "坚不可摧"},
            {name: "AsYourHeartDesires", value: "随心所欲"}
        ],
        "squads": [
            {name: "SpecialForceSquad", value: "特勤分队"},
            {name: "IS5NewSquad1", value: "高台突破分队"},
            {name: "IS5NewSquad2", value: "地面突破分队"},
            {name: "IS5NewSquad3", value: "游客分队"},
            {name: "IS5NewSquad4", value: "司岁台分队"},
            {name: "IS5NewSquad5", value: "天师府分队"},
            {name: "IS5NewSquad6", value: "花团锦簇分队"},
            {name: "IS5NewSquad7", value: "棋行险着分队"},
            {name: "IS5NewSquad8", value: "岁影回音分队"},
            {name: "LeaderSquad", value: "指挥分队"},
            {name: "SupportSquad", value: "后勤分队"},
            {name: "TacticalAssaultOperative", value: "突击战术分队"},
            {name: "TacticalFortificationOperative", value: "堡垒战术分队"},
            {name: "TacticalRangedOperative", value: "远程战术分队"},
            {name: "TacticalDestructionOperative", value: "破坏战术分队"},
            {name: "First-ClassSquad", value: "高规格分队"}
        ]
    }
}

MaaN.updateRoguelikeFromTheme = (theme) => {
    MaaN.updateSelects('tasks.farming.Roguelike.params.difficulty', [{name: "NotSwitch", value: -1}, {name: "Max", value: 0x7FFFFFFF}, ...Array.from({ length: MaaN.roguelikeData[theme].difficulty + 1 }, (_, i) => MaaN.roguelikeData[theme].difficulty - i)])
    MaaN.updateSelects('tasks.farming.Roguelike.params.mode', MaaN.roguelikeData[theme].modes)
    MaaN.updateSelects('tasks.farming.Roguelike.params.squad', MaaN.roguelikeData[theme].squads)
    MaaN.updateSelects('tasks.farming.Roguelike.params.roles', MaaN.roguelikeData[theme].roles)
}

MaaN.setBehaviour = {
    "tasks.copilot.Copilot.params.filename": (value) => {
        MaaN.clearLogs('copilot')
        MaaN.log(MaaN.getText('CopilotTip'), undefined, 'copilot')
        MaaN.set('tasks.ssscopilot.SSSCopilot.params.filename', value)
        Neutralino.filesystem.readFile(value).then((text) => {
            try {
                const task = JSON.parse(text)
                MaaN.log(task.stage_name, 'green', 'copilot')
                if (task.doc?.title) MaaN.log(task.doc.title, 'green', 'copilot')
                if (task.doc?.details) MaaN.log(task.doc.details, 'green', 'copilot')
            } catch (error) {
                MaaN.log(MaaN.getText('CopilotJsonError'), 'warn', 'copilot')
            }
        }).catch((error) => {
            MaaN.log(MaaN.getText('CopilotFileReadError'), 'warn', 'copilot')
        })
    },
    "config.ui.background.transparency": () => {
        MaaN.reloadBackgroundStyle()
    },
    "config.ui.background.image": () => {
        MaaN.reloadBackground()
    },
    "config.ui.background.opacity": () => {
        MaaN.reloadBackgroundStyle()
    },
    "config.ui.background.blur": () => {
        MaaN.reloadBackgroundStyle()
    },
    "config.ui.background.resize": () => {
        MaaN.reloadBackgroundStyle()
    },
    "config.ui.background.repeat": () => {
        MaaN.reloadBackgroundStyle()
    },
    "config.ui.font": () => {
        MaaN.reloadFont()
    },
    'config.ui.theme': (value) => {
        document.body.className = value
        document.body.classList.toggle('amoled_display', MaaN.config.ui.amoled_dark)
        document.body.classList.toggle('transparent', MaaN.config.ui?.background?.transparency)
    },
    'config.ui.amoled_dark': (value) => {
        document.body.classList.toggle('amoled_display', value)
    },
    "config.ui.tray": () => {
        MaaN.setTray()
    },
    "profile.instance_options.touch_mode": (value) => {
        if (value == 'MacPlayTools') {
            MaaN.set('profile.resource.platform_diff_resource', 'iOS')
        } else MaaN.set('profile.resource.platform_diff_resource')
    },
    "config.profile.others.hide_unavailable_stages": (value) => {
        MaaN.updateOpenStages()
    },
    "tasks.farming.Roguelike.params.theme": (value) => {
        MaaN.updateRoguelikeFromTheme(value)
    }
}

MaaN.set = (path, value) => {
    if (path == 'config.profile') {
        if (/[^0-9A-Za-z_\-]/.test(value)) {
            Neutralino.os.showMessageBox('Profile Error', 'The profile name can only have alphanumerical characters, hyphens and underscores.', undefined, 'WARNING')
            return
        }
        MaaN.lock()
        MaaN.config.profile = value
        if (!MaaN.config.profiles[value]) MaaN.config.profiles[value] = MaaN.emptyConfigProfile
        MaaN.writeConfig().then(() => Neutralino.app.restartProcess())
        return
    }
    if (path == 'client_type') {
        MaaN.set('tasks.farming.StartUp.params.client_type', value)
        MaaN.set('tasks.farming.Fight.params.client_type', value)
        MaaN.set('tasks.farming.CloseDown.params.client_type', value)
        MaaN.set('profile.resource.global_resource', MaaN.globalResources.includes(value) ? value : undefined)
        MaaN.updateOpenStages()
        MaaN.updateTitle()
        return
    }
    const configPath = path.split('.')
    let config = MaaN[configPath[0]]
    let i = 1
    if (configPath[0] == 'tasks') {
        config = config[configPath[1]].tasks.find(task => task.name == configPath[2])
        i += 2
    } else if (configPath[0] == 'config' && configPath[1] == 'profile') {
        config = Object.entries(config.profiles).find(([key]) => key == MaaN.config.profile)
        if (!config) {
            Neutralino.os.showMessageBox('Profile Error', 'The profile was not found.', undefined, 'WARNING')
            return
        }
        config = config[1]
        i += 1
    }
    for (; i < configPath.length - 1 && config; i++) {
        if (!config.hasOwnProperty(configPath[i])) {
            config[configPath[i]] = {}
        }
        config = config[configPath[i]]
    }
    if (!config) return
    if (config[configPath.slice(-1)[0]] !== value) config[configPath.slice(-1)[0]] = value
    if (MaaN.setBehaviour.hasOwnProperty(path)) MaaN.setBehaviour[path](value)
    if (configPath[0] == 'config') MaaN.writeConfig()
    if (configPath[0] == 'profile') MaaN.writeProfile(MaaN.config.profile)
    if (configPath[0] == 'tasks') MaaN.writeTasks(configPath[1])
    if (path.includes('connection') || path.includes('title_bar')) MaaN.updateTitle()
    if (path.startsWith('config.schedules')) MaaN.scheduleTasks()
    if (path.startsWith('config.profile.post_actions')) MaaN.updatePostActions()
    if (path == 'config.ui.language' && MaaN.screen == 'Settings' || path == 'config.ui.language_operator_name') {
        const scrollTop = document.getElementById('SettingsScreenMain').scrollTop
        MaaN.reloadUI()
        const main = document.getElementById('SettingsScreenMain')
        if (main && scrollTop) main.scrollTop = scrollTop
        if (!MaaN.locked) MaaN.unlock()
    } else if (path == 'config.ui.language') MaaN.reloadUI()
}

MaaN.get = (path) => {
    if (path == 'client_type') {
        const client_type = MaaN.get('tasks.farming.StartUp.params.client_type')
        if (MaaN.clientTypes.includes(client_type)) return client_type
        return undefined
    }
    const configPath = path.split('.')
    let config = MaaN[configPath[0]]
    let i = 1
    if (configPath[0] == 'tasks') {
        config = config[configPath[1]].tasks.find(task => task.name == configPath[2])
        if (!config) return undefined
        i += 2
    } else if (configPath.length > 2 && configPath[0] == 'config' && configPath[1] == 'profile') {
        config = Object.entries(config.profiles).find(([key]) => key == MaaN.config.profile)
        if (!config) return undefined
        config = config[1]
        i += 1
    }
    for (; i < configPath.length && config; i++) config = config[configPath[i]] ?? undefined
    return config
}

MaaN.updateInput = (path, value) => {
    document.getElementsByName(path).forEach(input => {
        switch (input.type) {
            case 'checkbox':
                input.checked = value
            default:
                if (value !== input.value) input.value = value
                break
        }
        if (input.classList.contains('dropdown')) input.parentNode.querySelectorAll('ul > li').forEach(option => {
            option.classList.toggle('selected', option.textContent == value)
        })
    })
}

MaaN.localization = {}

MaaN.render = (screens, nodeName) => {
    const nodeData = screens[nodeName]
    if (!nodeData) return null
    const node = document.createElement(nodeData.node ?? 'div')
    node.id = nodeName
    if (nodeData.style) node.style = nodeData.style
    if (nodeData.type) node.type = nodeData.type
    node.textContent = nodeData.name ? MaaN.getText(nodeData.name) : undefined
    if (nodeData.list) {
        if (nodeData.renderer) {
            nodeData.list.forEach((childName) => {
                node.append(nodeData.renderer(childName))
            })
        } else {
            nodeData.list.forEach((childName) => {
                node.append(MaaN.render(screens, childName))
            })
        }
    }
    if (nodeData.events) Object.entries(nodeData.events).forEach(([eventType, eventHandler]) => node.addEventListener(eventType, eventHandler))
    return node
}

MaaN.getText = (textId, args=[], kwargs={}) => {
    if (textId === undefined) return textId
    if (typeof textId == 'number') return textId.toString()
    let text = MaaN.localization[MaaN.config.ui.language][textId]
    if (!text) return 'localization.key.'+textId
    return text.replace(/\{(\d)\}/g, (t, key) => args[parseInt(key)] ?? t).replace(/\{key=(.*?)\}/g, (t, key) => MaaN.getText(key) ?? t).replace(/\{(.*?)\}/g, (t, key) => kwargs[key] ?? t).replaceAll('&#10;', '\n').replaceAll('\\n', '\n').replaceAll('&#160;', ' ')
}

MaaN.getOperatorId = (text) => {
    const entry = Object.entries(MaaN.operatorData.chars).find(([key, value]) => value && (value.name == text || value.name_en == text || value.name_jp == text || value.name_kr == text || value.name_tw == text))
    return entry ? entry[0] : undefined
}

MaaN.getOperatorName = (text) => {
    const entry = Object.entries(MaaN.operatorData.chars).find(([key]) => key == text)
    return entry ? entry[1].name : undefined
}

MaaN.setTray = () => {
    if (NL_OS != "Darwin" && MaaN.config.ui?.tray) Neutralino.os.setTray({
        icon: "/resources/icons/tray.png",
        menuItems: [
            MaaN.currentSession ? {id: "TRAY_STOP", text: MaaN.getText('Stop'), isDisabled: MaaN.locked} : {id: "TRAY_START", text: MaaN.getText('Farming'), isDisabled: MaaN.locked},
            {text: "-"},
            {id: "TRAY_FORCETOP", text: MaaN.getText('ForceShow'), isChecked: MaaN.forceShow},
            // {id: "TARY_HIDETRAY", text: MaaN.getText('HideTray')},
            {id: "TRAY_RESTART", text: MaaN.getText('Restart')},
            {id: "TRAY_EXIT", text: MaaN.getText('Exit')}
        ]
    })
}

MaaN.timeFormatHandler = (date, format) => {
    switch (format) {
        case 'yyyyy': return date.getFullYear()
        case 'yyyy': return date.getFullYear().toString().slice(-4)
        // case 'yyy': return date.getFullYear().toString().slice(-3)
        case 'yy': return date.getFullYear().toString().slice(-2)
        // case 'MMMM': return date.toLocaleString(MaaN.config.ui.language, {month: 'long'})
        // case 'MMM': return date.toLocaleString(MaaN.config.ui.language, {month: 'short'})
        case 'MM': return (date.getMonth() + 1).toString().padStart(2, '0')
        case 'M': return (date.getMonth() + 1)
        case 'dd': return date.getDate().toString().padStart(2, '0')
        case 'd': return date.getDate()
        case 'HH': return date.getHours().toString().padStart(2, '0')
        case 'H': return date.getHours()
        case 'hh': return (date.getHours() % 12 || 12).toString().padStart(2, '0')
        case 'h': return date.getHours() % 12 || 12
        case 'A': return date.getHours() >= 12 ? 'PM' : 'AM'
        case 'a': return date.getHours() >= 12 ? 'pm' : 'am'
        case 'mm': return date.getMinutes().toString().padStart(2, '0')
        case 'm': return date.getMinutes()
        case 'ss': return date.getSeconds().toString().padStart(2, '0')
        case 's': return date.getSeconds()
        case 'SSS': return date.getMilliseconds().toString().padStart(3, '0')
        case 'SS': return Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0')
        case 'S': return Math.floor(date.getMilliseconds() / 100)
        default: return format
    }
}

MaaN.getDateString = (formatString) => {
    const date = new Date()
    return formatString.replace(/y+|M+|d+|H+|h+|a+|m+|s+|S+/g, format => MaaN.timeFormatHandler(date, format))
}

MaaN.log = (text, level="log", logMode=MaaN.logMode) => {
    const logContainer = (logMode == 'copilot' || logMode == 'ssscopilot') ? document.getElementById('CopilotScreenLogs') : document.getElementById('FarmingScreenLogs')
    if (!logContainer) return console.log(text)
    const node = document.createElement('div')
    if (level) node.classList.add(level.toLowerCase())
    const time = document.createElement('span')
    time.textContent = MaaN.getDateString(MaaN.config.ui.time_format ?? 'HH:mm:ss')
    const textNode = document.createElement('div')
    textNode.textContent = text
    node.append(time)
    node.append(textNode)
    logContainer.append(node)
    node.scrollIntoView()
}

MaaN.clearLogs = (logMode=null) => {
    if (!logMode) document.querySelectorAll('[id$="ScreenLogs"]').forEach(logContainer => logContainer.innerHTML = '')
    if (logMode) {
        const logContainer = (logMode == 'copilot' || logMode == 'ssscopilot') ? document.getElementById('CopilotScreenLogs') : document.getElementById('FarmingScreenLogs')
        if (!logContainer) return
        logContainer.innerHTML = ''
    }
}

MaaN.logTable = {
    'UnsupportedResolution': 'ResolutionNotSupported',
    'ResolutionError': 'ResolutionAcquisitionFailure',
    'ReconnectSuccess': 'ReconnectSuccess',
    'ScreencapFailed': 'ScreencapFailed',
    'TouchModeNotAvailable': 'TouchModeNotAvailable',
    'MissionStart': 'MissionStart',
    'PRTS error': 'ActingCommandError',
    'Refresh Tags': 'Refreshed',
    'Recruit': 'RecruitConfirm',
    'Exploration Abandoned': 'ExplorationAbandoned',
    'MissionCompleted': 'FightCompleted',
    'MissionFailed': 'FightFailed',
    'StageTraderEnter': 'Trader',
    'StageSafeHouseEnter': 'SafeHouse',
    'StageCambatDpsEnter': 'CombatDps',
    'EmergencyDpsEnter': 'EmergencyDps',
    'DreadfulFoe': 'DreadfulFoe',
    'TraderInvestSystemFull': 'UpperLimit',
    'RoguelikeGamePass': 'RoguelikeGamePass',
    'MissionStart': 'StartCombat',
    'RoguelikeSpecialItemBought': 'RoguelikeSpecialItemBought',
    'ProductIncorrect': 'ProductIncorrect',
    'ProductUnknown': 'ProductUnknown',
    'ProductChanged': 'ProductChanged',
    'NotEnoughStaff': 'NotEnoughStaff',
    'StageInfoError': 'StageInfoError',
    'SSSGamePass': 'SSSGamePass',
    'UnsupportedLevel': 'UnsupportedLevel'
}

MaaN.useCustomLogs = (logData, logLevel) => {
    if (MaaN.logTable.hasOwnProperty(logData)){
        MaaN.log(MaaN.getText(MaaN.logTable[logData]), logLevel)
        return true
    } else if ((logData.endsWith(' Start') || logData.endsWith(' Completed'))) {
        const logt = logData.split(' ')
        if (logt.length != 2) return false
        const task = MaaN.tasks[MaaN.defaultTasks].tasks.find(task => task.params?.enable && task.name === logt[0])
        if (!task) return true
        MaaN.log((logt[1] == 'Completed' ? MaaN.getText('CompleteTask') : MaaN.getText('StartTask')) + MaaN.getText(task.name), logLevel)
        return true
    } else if (logData.startsWith('FastestWayToScreencap ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('FastestWayToScreencap', [logt[2], logt[1]]), logLevel)
        return true
    } else if (logData.startsWith('RecruitingTips: ')) {
        return true
    } else if (logData.startsWith('RecruitResult: ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('RecruitingResults') + logt.slice(1).join(' '), logLevel)
        if (logData.includes('★★★★★★')) {
            MaaN.log(MaaN.getText('RecruitmentOfStar', [6]))
            if (MaaN.config.ui.system_notification) Neutralino.os.showNotification(MaaN.getText('RecruitmentOfStar', [6]), '', 'INFO')
        } else if (logData.includes('★★★★★')) {
            MaaN.log(MaaN.getText('RecruitmentOfStar', [5]))
            if (MaaN.config.ui.system_notification) Neutralino.os.showNotification(MaaN.getText('RecruitmentOfStar', [5]), '', 'INFO')
        } 
        return true
    } else if (logData.startsWith('EnterFacility ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('ThisFacility') + MaaN.getText(logt[1]) + ' ' + logt[2], logLevel)
        return true
    } else if (logData.startsWith('ProductOfFacility: ')) {
        return true
    } else if (logData.startsWith('Current sanity: ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('CurrentSanity', logt[2].split('/')), logLevel)
        return true
    } else if (logData.startsWith('Mission started ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('MissionStart.FightTask', [logt[2].slice(1), logt[5]]), logLevel)
        return true
    } else if (logData.startsWith('Start exploration ')) {
        MaaN.log(MaaN.getText('BegunToExplore'), logLevel)
        return true
    } else if (logData.startsWith('Deposit ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('RoguelikeInvestment', [logt[1], logt[3], logt[5]]), logLevel)
        return true
    } else if (logData.startsWith('StartCombat ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('StartCombat') + logt.slice(1).join(' '), logLevel)
        return true
    } else if (logData.startsWith('CurrentSteps ')) {
        const logt = logData.split(' ')
        MaaN.log(MaaN.getText('CurrentSteps', logt.slice(1)), logLevel)
        return true
    } else if (logData == 'AllTasksCompleted') {
        const text = MaaN.getText('AllTasksComplete', [MaaN.getTimeString(performance.now() - MaaN.lastRunTime)])
        MaaN.log(text, logLevel)
        if (MaaN.config.ui.system_notification) Neutralino.os.showNotification(text.split('\n')[0], text.split('\n')[1], 'INFO')
        return true
    }
    return
}

MaaN.getTimeString = (ms) => {
    if (ms <= 0) return '0s'
    let result = ''
    if (ms >= 86400000) result += Math.floor(ms / 86400000)      + 'd '
    if (ms >=  3600000) result += Math.floor(ms /  3600000) % 24 + 'h '
    if (ms >=    60000) result += Math.floor(ms /    60000) % 60 + 'm '
                        result += Math.floor(ms /     1000) % 60 + 's'
    return result
}

MaaN.resetTemporalTasks = () => {
    MaaN.set('tasks.farming.Recruit.params.expedite', false)
    MaaN.updateInput('tasks.farming.Recruit.params.expedite', false)
    MaaN.set('tasks.farming.Fight.params.stone', 0)
    MaaN.updateInput('tasks.farming.Fight.params.stone', 0)
    if (MaaN.get('config.profile.post_actions.only_once')) {
        MaaN.set('tasks.farming.CloseDown.params.enable', false)
        MaaN.updateInput('tasks.farming.CloseDown.params.enable', false)
    }
}

MaaN.updatePostActions = () => {
    const element = document.getElementById('FarmingScreenMainAfterInfoBehaviour')
    if (!element) return
    let text = ''
    const clientAction = MaaN.get('config.profile.post_actions.client')
    if (clientAction && clientAction != 'DoNothing') text = MaaN.getText(clientAction)
    const selfAction = MaaN.get('config.profile.post_actions.self')
    const systemAction = MaaN.get('config.profile.post_actions.os')
    if (selfAction && selfAction != 'DoNothing') {
        if (text) text += ' → '
        text += MaaN.getText(selfAction)
    } else if (systemAction && systemAction != 'DoNothing') {
        if (text) text += ' → '
        text += MaaN.getText(systemAction)
    }
    if (!text) text = MaaN.getText('DoNothing')
    element.textContent = text
}

MaaN.filePathHandler = (path) => {
    return path
}

MaaN.currentSession = null
MaaN.lastRunTime = null
MaaN.scheduledTasks = null

MaaN.getNextSchedule = () => {
    const now = new Date()
    let target = {schedule: null, t: null}
    const schedules = MaaN.config.schedules ?? []
    schedules.forEach((schedule) => {
        if (!schedule || !schedule.enabled) return
        if (!schedule.time) return
        const [hourStr, minuteStr] = schedule.time.split(':')
        const t = new Date(now)
        t.setHours(parseInt(hourStr), parseInt(minuteStr), 0, 0)
        if (isNaN(t)) return
        if (now > t) t.setDate(t.getDate()+1)
        if (!target.t || target.t > t) target = {schedule, t}
    })
    return target
}

MaaN.scheduleTasks = () => {
    if (MaaN.scheduledTasks) clearTimeout(MaaN.scheduledTasks)
    MaaN.scheduledTasks = null
    const {schedule, t} = MaaN.getNextSchedule()
    if (!schedule) return
    MaaN.scheduledTasks = setTimeout(() => MaaN.startScheduledTasks(schedule.forced), t.getTime() - Date.now())
    console.log('Scheduled tasks at ' + t.toTimeString())
}

MaaN.startScheduledTasks = async (forced=false) => {
    MaaN.scheduleTasks()
    if (!MaaN.currentSession) return await MaaN.startTasks(MaaN.defaultTasks)
    if (forced) {
        await MaaN.stopTasks()
        await Neutralino.os.execCommand(MaaN.cliPath + 'closedown --profile MaaN --batch --no-summary ' + MaaN.get('client_type'))
        return await MaaN.startTasks(MaaN.defaultTasks)
    }
    return
}

MaaN.startOrStopTasks = async (taskName) => {
    if (!MaaN.currentSession) return await MaaN.startTasks(taskName)
    return await MaaN.stopTasks()
}

MaaN.restartAdbServer = async () => {
    await Neutralino.os.execCommand(MaaN.filePathHandler(MaaN.get('profile.connection.adb_path')) + ' kill-server')
    await Neutralino.os.execCommand(MaaN.filePathHandler(MaaN.get('profile.connection.adb_path')) + ' start-server')
}

MaaN.startTasks = async (taskName=MaaN.defaultTasks) => {
    if (MaaN.currentSession || MaaN.locked) return
    MaaN.lock()
    MaaN.clearLogs()
    MaaN.logMode = taskName
    MaaN.log(MaaN.getText('Running'))
    const startButtons = document.querySelectorAll('.startbutton')
    startButtons.forEach((button) => {
        button.textContent = MaaN.getText('Stop')
    })
    MaaN.lastRunTime = performance.now()
    switch (taskName) {
        case 'copilot':
        case 'ssscopilot':
            if (!MaaN.get('config.profile.scripts.on_copilot')) break
        case 'farming':
            if (MaaN.get('config.profile.scripts.pre')) await Neutralino.os.execCommand(MaaN.get('config.profile.scripts.pre'))
            break
    }
    let devices = await MaaN.getDevices()
    if (!devices.length && MaaN.get('config.profile.startup.retry_emulator')) {
        MaaN.log(MaaN.getText('ConnectFailed'), 'warn')
        await MaaN.bootAndroid()
        MaaN.log(MaaN.getText('TryToStartEmulator'))
        const delay = MaaN.get('config.profile.startup.delay') ?? 30
        MaaN.log(MaaN.getText('WaitForEmulator') + ': ' + MaaN.getTimeString(delay * 1000))
        setTimeout(() => Neutralino.os.execCommand(MaaN.filePathHandler(MaaN.get('profile.connection.adb_path')) + ' connect ' + (MaaN.get('profile.connection.address') ?? ''), {background: true}), Math.max(delay * 1000 - 2000, 1000))
        await new Promise(resolve => setTimeout(resolve, delay * 1000))
        MaaN.log(MaaN.getText('TryToReconnectByAdb'))
        devices = await MaaN.getDevices()
    }
    if (!devices.length && MaaN.get('config.profile.startup.restart_adb_server')) {
        MaaN.log(MaaN.getText('ConnectFailed'), 'warn')
        MaaN.log(MaaN.getText('RestartAdb'))
        await MaaN.restartAdbServer()
        MaaN.log(MaaN.getText('TryToReconnectByAdb'))
        devices = await MaaN.getDevices()
    }
    if (!devices.length) {
        const startButtons = document.querySelectorAll('.startbutton')
        startButtons.forEach((button) => {
            button.textContent = MaaN.getText(button.name)
        })
        MaaN.log(MaaN.getText('ConnectFailed'), 'error')
        MaaN.unlock()
        return
    }
    if (MaaN.loggedTasks.includes(taskName)) try {
        await Neutralino.filesystem.remove(NL_PATH + divider + taskName + '.json')
    } catch (error) {
        console.warn(error)
    }
    MaaN.currentSession = await Neutralino.os.spawnProcess(MaaN.cliPath + 'run --profile MaaN --batch -v ' + MaaN.get('config.profile') + divider + taskName + (MaaN.loggedTasks.includes(taskName) ? (' --log-file=' + taskName + '.json') : ''))
    MaaN.unlock()
}

MaaN.stopTasks = async () => {
    if (!MaaN.currentSession) return
    MaaN.lock()
    MaaN.log(MaaN.getText('Stopping'))
    await Neutralino.os.updateSpawnedProcess(MaaN.currentSession.id, 'exit')
}

MaaN.lock = () => {
    const startButtons = document.querySelectorAll('.startbutton')
    startButtons.forEach((button) => {
        button.disabled = true
    })
    MaaN.locked = true
    MaaN.setTray()
}

MaaN.unlock = () => {
    const startButtons = document.querySelectorAll('.startbutton')
    startButtons.forEach((button) => {
        button.disabled = false
    })
    MaaN.locked = false
    MaaN.setTray()
}

MaaN.updateMaaCli = async () => {
    if (MaaN.locked || MaaN.currentSession) return
    MaaN.lock()
    const update = await Neutralino.os.execCommand(MaaN.cliPath + 'self update --batch -v ' + (MaaN.get('config.update.channel') ?? 'stable'))
    if (update.stdOut) MaaN.log(update.stdOut)
    if (update.stdErr) MaaN.log(update.stdErr, 'error')
    MaaN.unlock()
}

MaaN.updateMaaCore = async () => {
    if (MaaN.locked || MaaN.currentSession) return
    MaaN.lock()
    const update = await Neutralino.os.execCommand(MaaN.cliPath + 'update --batch -v ' + (MaaN.get('config.update.channel') ?? 'stable'))
    if (update.stdOut) MaaN.log(update.stdOut)
    if (MaaN.config.ui?.system_notification && update.stdOut.trim().endsWith('Already up to date.')) Neutralino.os.showNotification(MaaN.getText('AlreadyLatest'), '', 'INFO')
    if (update.stdErr) MaaN.log(update.stdErr, 'error')
    await MaaN.updatePath()
    MaaN.updateTitle()
    MaaN.unlock()
    await MaaN.updateOpenStages()
}

MaaN.updateMaaResource = async () => {
    if (MaaN.locked || MaaN.currentSession) return
    MaaN.lock()
    const update = await Neutralino.os.execCommand(MaaN.cliPath + 'hot-update --batch -v ')
    if (update.stdOut) MaaN.log(update.stdOut)
    if (MaaN.config.ui?.system_notification && update.stdOut.trim().endsWith('Already up to date.')) Neutralino.os.showNotification(MaaN.getText('AlreadyLatest'), '', 'INFO')
    if (update.stdErr) MaaN.log(update.stdErr, 'error')
    MaaN.unlock()
    await MaaN.updateOpenStages()
}

Neutralino.init()

MaaN.brokenLog = ''
MaaN.scheduleSystemAction = null

Neutralino.events.on('spawnedProcess', async (event) => {
    switch (event.detail.action) {
        case 'stdOut':
            console.log(event.detail.data)
            // MaaN.log(event.detail.data)
            return
        case 'stdErr':
            const data = event.detail.data.replace(/\x1B[[0-9;]*[a-zA-Z]/g, '')
            if (data.startsWith('Error:')) {
                MaaN.log(data, 'error')
                return
            }
            const logs = [...(MaaN.brokenLog + data).matchAll(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+([A-Z]{0,5})\s*\]\s*(.*?)(?=\[\d{4}-\d{2}-\d{2}|$)/gs)]
            logs.forEach(([n, timestamp, logLevel, logData]) => {
                logData = logData.trim()
                if (MaaN.useCustomLogs(logData, logLevel)) return
                MaaN.log(logData, logLevel)
            })
            if (MaaN.brokenLog) MaaN.brokenLog = ''
            const brokenLog = data.match(/\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\s+[A-Z]{0,5}\s*$/s)
            if (brokenLog) {
                MaaN.brokenLog = brokenLog[0]
            } else if (logs.length == 0) MaaN.log(data, 'log')
            return
        case 'exit':
            const startButtons = document.querySelectorAll('.startbutton')
            startButtons.forEach((button) => {
                button.textContent = MaaN.getText(button.name)
            })
            MaaN.currentSession = null
            if (event.detail.data == 2) {
                MaaN.resetTemporalTasks()
                if (MaaN.get('config.profile.scripts.on_manual_stop')) switch (MaaN.logMode) {
                    case 'copilot':
                    case 'ssscopilot':
                        if (!MaaN.get('config.profile.scripts.on_copilot')) break
                    case 'farming':
                        if (MaaN.get('config.profile.scripts.post')) await Neutralino.os.execCommand(MaaN.get('config.profile.scripts.post'))
                        break
                }
                MaaN.log(MaaN.getText('Stopped'))
            } else if (event.detail.data == 0) {
                MaaN.resetTemporalTasks()
                switch (MaaN.logMode) {
                    case 'operbox':
                        Neutralino.filesystem.readFile(NL_PATH + divider + 'operbox.json').then((text) => {
                            try {
                                MaaN.updateOperBoxData(JSON.parse(text.split('OperBox: ').slice(-1)[0].split('\n[')[0]))
                            } catch (error) {
                                console.warn(error)
                            }
                        })
                        document.getElementById('ToolboxScreenMainOperBoxRecognitionMessage').textContent = MaaN.getText('IdentificationCompleted')
                        break
                    case 'depot':
                        Neutralino.filesystem.readFile(NL_PATH + divider + 'depot.json').then((text) => {
                            try {
                                MaaN.updateDepotData(JSON.parse(text.split('Depot: ').slice(-1)[0].split('\n[')[0]))
                            } catch (error) {
                                console.warn(error)
                            }
                        })
                        document.getElementById('ToolboxScreenMainDepotRecognitionMessage').textContent = MaaN.getText('IdentificationCompleted')
                        break
                    case 'copilot':
                    case 'ssscopilot':
                        if (!MaaN.get('config.profile.scripts.on_copilot')) break
                    case 'farming':
                        if (MaaN.get('config.profile.scripts.post')) await Neutralino.os.execCommand(MaaN.get('config.profile.scripts.post'))
                        break
                }
                if (MaaN.androidActions.hasOwnProperty(MaaN.get('config.profile.post_actions.client'))) {
                    const action = MaaN.androidActions[MaaN.get('config.profile.post_actions.client')]
                    if (MaaN.get('config.profile.post_actions.only_once')) {
                        MaaN.set('config.profile.post_actions.client', "DoNothing")
                        MaaN.updateInput('config.profile.post_actions.client', MaaN.getText("DoNothing"))
                        MaaN.updatePostActions()
                    }
                    await action()
                }
                if (MaaN.selfActions.hasOwnProperty(MaaN.get('config.profile.post_actions.self'))) {
                    const action = MaaN.selfActions[MaaN.get('config.profile.post_actions.self')]
                    if (MaaN.get('config.profile.post_actions.only_once')) MaaN.set('config.profile.post_actions.self', "DoNothing")
                    await action()
                }
                if (MaaN.systemActions.hasOwnProperty(MaaN.get('config.profile.post_actions.os'))) {
                    const action = MaaN.systemActions[MaaN.get('config.profile.post_actions.os')]
                    if (MaaN.get('config.profile.post_actions.only_once')) {
                        MaaN.set('config.profile.post_actions.os', "DoNothing")
                        MaaN.updateInput('config.profile.post_actions.os', MaaN.getText("DoNothing"))
                    }
                    const waitTime = 30000
                    const progressBar = document.getElementById('SystemScreenMainVisualProgress')
                    progressBar.style.animation = 'fill-bar ' + waitTime.toString() + 'ms linear forwards'
                    MaaN.scheduleSystemAction = {
                        action,
                        id: setTimeout(async () => {
                            document.getElementById('SystemScreen').classList.remove('current')
                            await action()
                        }, waitTime)
                    }
                    document.getElementById('SystemScreen').classList.add('current')
                }
            }
            MaaN.unlock()
            MaaN.logMode = null
            return
    }
})

MaaN.updateOperBoxData = (operBoxData) => {
    if (operBoxData.what != "OperBoxInfo" || !operBoxData.details?.done) return
    if (operBoxData != MaaN.operBoxData) {
        Neutralino.filesystem.writeFile(NL_PATH + divider + 'operbox.json', JSON.stringify(operBoxData, undefined, 4))
        MaaN.operBoxData = operBoxData
    }
    document.getElementById('ToolboxScreenMainOperBoxRecognitionNavOperBoxNotHaveList').textContent = MaaN.getText('OperBoxNotHaveList', [operBoxData.details.all_opers.length - operBoxData.details.own_opers.length])
    document.getElementById('ToolboxScreenMainOperBoxRecognitionNavOperBoxHaveList').textContent = MaaN.getText('OperBoxHaveList', [operBoxData.details.own_opers.length])
    const notHaveList = document.getElementById('ToolboxScreenMainOperBoxRecognitionResultOperBoxNotHaveList')
    const haveList = document.getElementById('ToolboxScreenMainOperBoxRecognitionResultOperBoxHaveList')
    notHaveList.innerHTML = haveList.innerHTML = ''
    let nameSwitch = 'name'
    switch (MaaN.config.ui.language_operator_name ? MaaN.config.ui.language : MaaN.get('client_type')) {
        case 'en-us': case 'YoStarEN':
            nameSwitch = 'name_en'
            break
        case 'ja-jp': case 'YoStarJP':
            nameSwitch = 'name_jp'
            break
        case 'ko-kr': case 'YoStarKR':
            nameSwitch = 'name_kr'
            break
        case 'zh-tw': case 'txwy':
            nameSwitch = 'name_tw'
            break
    }
    operBoxData.details.all_opers.sort((value1, value2) => value1[nameSwitch] > value2[nameSwitch]).sort((value1, value2) => value2.rarity - value1.rarity).forEach(value => {
        const node = document.createElement('div')
        node.textContent = value[nameSwitch]
        if (value.rarity) node.classList.add('rarity_' + value.rarity)
        if (value.own) {
            haveList.append(node)
        } else {
            notHaveList.append(node)
        }
    })
}

MaaN.updateDepotData = (depotData) => {
    if (depotData.what != "DepotInfo" || !depotData.details?.done) return
    if (depotData != MaaN.depotData) {
        Neutralino.filesystem.writeFile(NL_PATH + divider + 'depot.json', JSON.stringify(depotData, undefined, 4))
        MaaN.depotData = depotData
    }
    const depotList = document.getElementById('ToolboxScreenMainDepotRecognitionResult')
    depotList.innerHTML = ''
    depotData.details.arkplanner.object.items.forEach(value => {
        const node = document.createElement('div')
        node.textContent = value.have + ' ' + value.name
        depotList.append(node)
    })
}

Neutralino.events.on("trayMenuItemClicked", (event) => {
    switch (event.detail.id) {
        case "TRAY_START":
            MaaN.startTasks()
            break
        case "TRAY_STOP":
            MaaN.stopTasks()
            break
        case "TRAY_FORCETOP": 
            MaaN.forceShow = !MaaN.forceShow
            Neutralino.window.setAlwaysOnTop(MaaN.forceShow)
            break
        case "TRAY_HIDETRAY":
            break
        case "TRAY_RESTART": return Neutralino.app.restartProcess()
        case "TRAY_EXIT": return MaaN.exit()
    }
    MaaN.setTray()
})

MaaN.exit = async () => {
    if (MaaN.currentSession) {
        MaaN.lock()
        MaaN.log(MaaN.getText('Stopping'))
        await Neutralino.os.updateSpawnedProcess(MaaN.currentSession.id, 'exit')
    }
    await Neutralino.app.exit()
}

Neutralino.events.on("windowClose", () => {
    MaaN.exit()
})

window.document.addEventListener('DOMContentLoaded', async () => {})

MaaN.updateTitle = () => {
    let title = MaaN.coreVersion
    if (MaaN.config.ui.title_bar.profile && MaaN.config.profile) title += ' (' + MaaN.config.profile + ')'
    if (MaaN.config.ui.title_bar.connection_preset && MaaN.profile.connection.config) title += ' - ' + MaaN.profile.connection.config
    if (MaaN.config.ui.title_bar.connection_address && MaaN.profile.connection.address) title += ' (' + MaaN.profile.connection.address + ')'
    if (MaaN.config.ui.title_bar.client_type && MaaN.get('client_type')) title += ' - ' + MaaN.getText(MaaN.get('client_type'))
    Neutralino.window.setTitle(title)
    if (MaaN.titleBar) MaaN.titleBarText.textContent = title
    document.title = title
}

const divider = NL_OS == 'Windows' ? '\\' : '/'

MaaN.updatePath = async () => {
    const maaTest = await Neutralino.os.execCommand('maa version maa-cli')
    if (maaTest.stdOut) {
        MaaN.cliPath = 'maa '
    }
    const maaRelativeTest = await Neutralino.os.execCommand(NL_PATH + divider + 'maa version maa-cli')
    if (maaRelativeTest.stdOut) {
        MaaN.cliPath = NL_PATH + divider + 'maa '
    }
    if (MaaN.cliPath) {
        const maaCoreTest = await Neutralino.os.execCommand(MaaN.cliPath + 'version maa-core')
        if (maaCoreTest.stdErr) {
            const installCore = await Neutralino.os.showMessageBox('MaaCore Missing', maaCoreTest.stdErr + '\nIf you proceed, maa-cli will attempt to install the latest stable version.', 'OK_CANCEL', 'WARNING')
            if (installCore == 'OK') {
                const message = await Neutralino.os.execCommand(MaaN.cliPath + 'install --batch --force')
                return await MaaN.updatePath()
            } else {
                await Neutralino.os.showMessageBox('MaaCore Missing', 'MaaCore is not found; Aborting.', undefined, 'ERROR')
                await MaaN.exit()
            }
        } else if (maaCoreTest.stdOut) {
            MaaN.coreVersion = maaCoreTest.stdOut.trim()
            await Neutralino.window.setTitle('MaaN - ' + MaaN.coreVersion)
            try {
                const resourceTest = await Neutralino.os.execCommand(MaaN.cliPath + 'dir resource')
                if (resourceTest.stdOut) {
                    MaaN.paths['resource'] = resourceTest.stdOut.trim()
                    MaaN.paths['copilot'] = resourceTest.stdOut.trim() + divider + 'copilot'
                } else throw resourceTest.stdErr
            } catch (error) {
                console.warn(error)
            }
            await MaaN.updateLocaleFromResources()
            return
        }
    } else {
        const openLink = await Neutralino.os.showMessageBox('maa-cli Missing', 'MaaN failed to detect maa-cli.\n\nmaa-cli must be either installed globally, or located in the same folder with MaaN.\n\nDo you want to open GitHub link for the executable files?', 'YES_NO', 'QUESTION')
        if (openLink == 'YES') {
            Neutralino.os.open('https://github.com/MaaAssistantArknights/maa-cli/releases')
            const retry = await Neutralino.os.showMessageBox('maa-cli Missing', 'Please try again after downloading maa-cli.', 'RETRY_CANCEL', 'INFO')
            if (retry == 'RETRY') {
                return await MaaN.updatePath()
            }
        }
        await Neutralino.os.showMessageBox('maa-cli Missing', 'maa-cli is not found; Aborting.', undefined, 'ERROR')
        await MaaN.exit()
    }
}

MaaN.updateLocaleFromResources = async () => {
    try {
        const operatorText = await Neutralino.filesystem.readFile(MaaN.paths['resource'] + divider + 'battle_data.json')
        MaaN.operatorData = JSON.parse(operatorText)
        Object.entries(MaaN.operatorData.chars).forEach(([key, {name, name_en, name_jp, name_kr, name_tw}]) => {
            MaaN.localization['zh-cn'][key] = name
            MaaN.localization['en-us'][key] = name_en
            MaaN.localization['ja-jp'][key] = name_jp
            MaaN.localization['ko-kr'][key] = name_kr
            MaaN.localization['zh-tw'][key] = name_tw
        })
    } catch (error) {
        console.warn(error)
    }
}

MaaN.writeConfig = async () => {
    await Neutralino.filesystem.writeFile(NL_PATH + divider + MaaN.instanceConfigPath, JSON.stringify(MaaN.config, undefined, 4))
}

MaaN.writeProfile = async (name=MaaN.config.profile) => {
    const dirConfigPath = await MaaN.getConfigPath()
    await Neutralino.filesystem.writeFile(dirConfigPath + divider + 'profiles' + divider + name + '.json', JSON.stringify(MaaN.profile, undefined, 4))
}

MaaN.writeTasks = async (name=MaaN.defaultTasks) => {
    const dirConfigPath = await MaaN.getConfigPath()
    await Neutralino.filesystem.writeFile(dirConfigPath + divider + 'tasks' + divider + MaaN.config.profile + divider + name + '.json', JSON.stringify(MaaN.tasks[name], undefined, 4))
}

MaaN.getConfigPath = async () => {
    const dirConfigExec = await Neutralino.os.execCommand(MaaN.cliPath + 'dir config --batch')
    if (dirConfigExec.stdErr) throw dirConfigExec.stdErr
    return dirConfigExec.stdOut.trim()
}

MaaN.loadConfig = async () => {
    const dirConfigPath = await MaaN.getConfigPath()
    try {
        let dirConfig
        try {
            dirConfig = await Neutralino.filesystem.readDirectory(dirConfigPath)
        } catch (error) {
            if (error.code == 'NE_FS_NOPATHE') {
                dirConfig = []
            }
        }
        const dirCurrent = await Neutralino.filesystem.readDirectory(NL_PATH)
        if (!dirCurrent.find(({entry}) => entry == MaaN.instanceConfigPath)) await MaaN.writeConfig()
        const configText = await Neutralino.filesystem.readFile(NL_PATH + divider + MaaN.instanceConfigPath)
        MaaN.config = JSON.parse(configText)
        if (!MaaN.config.ui.language) {
            const localeString = NL_LOCALE.toLowerCase()
            let language = ''
            if (NL_OS == 'Windows') {
                if (localeString.startsWith('chinese')) {
                    language = 'zh-cn'
                    if (localeString.includes('hongkong') || localeString.includes('hong-kong') || localeString.includes('traditional')) language = 'zh-tw'
                } else if (localeString.startsWith('english') || localeString.startsWith('american')) {
                    language = 'en-us'
                } else if (localeString.startsWith('japanese')) {
                    language = 'ja-jp'
                } else if (localeString.startsWith('korean')) {
                    language = 'ko-kr'
                } else {
                    language = ''
                }
            } else {
                if (localeString.includes(';')) {
                    const localeData = Object.fromEntries(localeString.split(';').map(line => line.split('=')))
                    language = (localeData.lang || localeData.lc_ctype || localeData.lc_messages || '').split('.')[0].replace('_', '-')
                } else language = localeString.split('.')[0].replace('_', '-')
                if (language.startsWith('en-')) language = 'en-us'
            }
            if (MaaN.locales.includes(language)) MaaN.set('config.ui.language', language)
        }
        if (!MaaN.locales.includes(MaaN.config.ui?.language)) {
            MaaN.set('config.ui.language', MaaN.locales[0])
            await Neutralino.os.showMessageBox('Language Error', 'The current language is invalid or not supported. The default language (English) will be used.', undefined, 'WARNING')
        }

        if (dirCurrent.find(({entry}) => entry == 'operbox.json')) try {
            const operBoxText = await Neutralino.filesystem.readFile(NL_PATH + divider + 'operbox.json')
            MaaN.operBoxData = JSON.parse(operBoxText)
        } catch (error) {
            console.warn(error)
        }

        if (dirCurrent.find(({entry}) => entry == 'depot.json')) try {
            const depotText = await Neutralino.filesystem.readFile(NL_PATH + divider + 'depot.json')
            MaaN.depotData = JSON.parse(depotText)
        } catch (error) {
            console.warn(error)
        }

        const dirProfileEntry = dirConfig.find(({entry}) => entry == 'profiles')
        if (!dirProfileEntry) await Neutralino.filesystem.createDirectory(dirConfigPath + divider + 'profiles')
        const profiles = await Neutralino.filesystem.readDirectory(dirConfigPath + divider + 'profiles')
        const profileEntry = profiles.find(({entry}) => entry == MaaN.config.profile + '.json')
        if (!profileEntry) {
            await MaaN.writeProfile(MaaN.config.profile)
        }
        const profileText = await Neutralino.filesystem.readFile(dirConfigPath + divider + 'profiles' + divider + MaaN.config.profile + '.json')
        MaaN.profile = JSON.parse(profileText)

        const dirTasksEntry = dirConfig.find(({entry}) => entry == 'tasks')
        if (!dirTasksEntry) await Neutralino.filesystem.createDirectory(dirConfigPath + divider + 'tasks')
        const dirTasksProfile = await Neutralino.filesystem.readDirectory(dirConfigPath + divider + 'tasks')
        const dirTasksProfileEntry = dirTasksProfile.find(({entry}) => entry == MaaN.config.profile)
        if (!dirTasksProfileEntry) await Neutralino.filesystem.createDirectory(dirConfigPath + divider + 'tasks' + divider + MaaN.config.profile)
        const tasks = await Neutralino.filesystem.readDirectory(dirConfigPath + divider + 'tasks' + divider + MaaN.config.profile)

        for (let i = 0; i < Object.keys(MaaN.tasks).length; i++) {
            const name = Object.keys(MaaN.tasks)[i]
            const filename = name + '.json'
            const tasksEntry = tasks.find(({entry}) => entry == filename)
            if (!tasksEntry) await Neutralino.filesystem.writeFile(dirConfigPath + divider + 'tasks' + divider + MaaN.config.profile + divider + filename, JSON.stringify(MaaN.tasks[name], undefined, 4))
            const tasksText = await Neutralino.filesystem.readFile(dirConfigPath + divider + 'tasks' + divider + MaaN.config.profile + divider + filename)
            MaaN.tasks[name] = JSON.parse(tasksText)
        }
    } catch (error) {
        console.error(error)
    }
}

if (NL_ARGS.includes('--window-borderless') || window.NL_CUSTOM_UI == 'WinUI') {
    MaaN.titleBar = document.createElement('div')
    MaaN.titleBar.id = '_Title'
    MaaN.titleBarText = document.createElement('div')
    MaaN.titleBarText.textContent = 'Maa'
    MaaN.titleBarText.addEventListener('dblclick', async () => {
        await Neutralino.window.isMaximized() ? await Neutralino.window.unmaximize() : await Neutralino.window.maximize()
    })
    MaaN.titleBar.append(MaaN.titleBarText)
    const titleBarButtons = document.createElement('div')
    const titleBarButtonPin = document.createElement('button')
    titleBarButtonPin.id = 'TitleBarButtonPin'
    titleBarButtonPin.addEventListener('click', async () => {
        MaaN.forceShow = !MaaN.forceShow
        await Neutralino.window.setAlwaysOnTop(MaaN.forceShow)
        MaaN.setTray()
    })
    const titleBarButtonMinimize = document.createElement('button')
    titleBarButtonMinimize.id = 'TitleBarButtonMinimize'
    titleBarButtonMinimize.addEventListener('click', async () => {
        await Neutralino.window.minimize()
    })
    const titleBarButtonMaximize = document.createElement('button')
    titleBarButtonMaximize.id = 'TitleBarButtonMaximize'
    titleBarButtonMaximize.addEventListener('click', async () => {
        await Neutralino.window.isMaximized() ? await Neutralino.window.unmaximize() : await Neutralino.window.maximize()
    })
    const titleBarButtonClose = document.createElement('button')
    titleBarButtonClose.id = 'TitleBarButtonClose'
    titleBarButtonClose.addEventListener('click', async () => {
        await MaaN.exit()
    })
    titleBarButtons.append(titleBarButtonPin)
    titleBarButtons.append(titleBarButtonMinimize)
    titleBarButtons.append(titleBarButtonMaximize)
    titleBarButtons.append(titleBarButtonClose)
    MaaN.titleBar.append(titleBarButtons)
    Neutralino.window.setDraggableRegion(MaaN.titleBarText)

    if (NL_OS != 'Windows') {
        MaaN.resizeAreas = []
        let position, clientWidth, clientHeight, currentDirection
        const directions = ['N', 'E', 'S', 'W', 'NE', 'SE', 'SW', 'NW']
        const resize = (event) => {
            if (!position || !clientWidth || !clientHeight || !currentDirection) return
            let width = clientWidth
            let height = clientHeight
            if (currentDirection == 'NW') {
                Neutralino.window.move(event.screenX, event.screenY)
                width += position.x - event.screenX
                height += position.y - event.screenY
            } else {
                if (currentDirection.includes('N')) {
                    Neutralino.window.move(position.x, event.screenY)
                    height += position.y - event.screenY
                } else if (currentDirection.includes('S')) height = event.clientY
                if (currentDirection.includes('W')) {
                    Neutralino.window.move(event.screenX, position.y)
                    width += position.x - event.screenX
                } else if (currentDirection.includes('E')) width = event.clientX
            }
            if (width < 1) width = 1
            if (height < 1) height = 1
            Neutralino.window.setSize({width, height})
        }
        const stopResize = () => {
            document.removeEventListener('mousemove', resize)
            document.removeEventListener('mouseup', stopResize)
        }
        directions.forEach(direction => {
            const resizer = document.createElement('div')
            resizer.classList.add('resizer')
            resizer.id = 'Resize' + direction
            resizer.addEventListener('mousedown', async () => {
                position = await Neutralino.window.getPosition()
                currentDirection = direction
                clientWidth = document.documentElement.clientWidth
                clientHeight = document.documentElement.clientHeight
                document.addEventListener('mousemove', resize)
                document.addEventListener('mouseup', stopResize)
            })
            MaaN.resizeAreas.push(resizer)
        })
    } else Neutralino.window.setSize({resizable: true})
}

MaaN.background = null
MaaN.backgroundElement = document.createElement('div')
MaaN.backgroundElement.id = '_Background'

MaaN.reloadBackground = () => {
    if (MaaN.background) {
        URL.revokeObjectURL(MaaN.background)
        MaaN.background = null
    }
    if (MaaN.config.ui?.background?.image) {
        Neutralino.filesystem.readBinaryFile(NL_OS == 'Windows' ? MaaN.config.ui.background.image.replace(/^"(.*)"$/, (match, p) => p.replace(/\\\\$/, '\\')) : MaaN.config.ui.background.image.replace(/^'(.*)'$/, (match, p) => p.replaceAll("\\'", "'"))).then(arrayBuffer => {
            MaaN.background = URL.createObjectURL(new Blob([arrayBuffer]))
            MaaN.backgroundElement.style.backgroundImage = 'url(' + MaaN.background + ')'
            MaaN.reloadBackgroundStyle()
        }).catch(() => {
            MaaN.backgroundElement.style.backgroundImage = 'none'
        })
    } else {
        MaaN.backgroundElement.style.backgroundImage = 'none'
        MaaN.reloadBackgroundStyle()
    }
}

MaaN.reloadBackgroundStyle = () => {
    document.body.classList.toggle('transparent', MaaN.config.ui?.background?.transparency)
    MaaN.backgroundElement.style.backgroundPosition = 'center'
    if (!MaaN.config.ui?.background) return
    MaaN.backgroundElement.style.opacity = MaaN.config.ui.background.opacity ?? 1
    if (MaaN.config.ui.background.blur || MaaN.config.ui.background.blur == 0) MaaN.backgroundElement.style.filter = 'blur(' + MaaN.config.ui.background.blur * 50 + 'px)'
    if (MaaN.config.ui.background.repeat) {
        MaaN.backgroundElement.style.backgroundSize = 'auto'
        switch (MaaN.config.ui.background.resize) {
            case "fill":
                MaaN.backgroundElement.style.backgroundPosition = 'unset'
                MaaN.backgroundElement.style.backgroundRepeat = 'round'
                break
            case "contain":
                MaaN.backgroundElement.style.backgroundSize = 'auto'
                MaaN.backgroundElement.style.backgroundRepeat = 'space'
                break
            case "cover":
                MaaN.backgroundElement.style.backgroundSize = 'contain'
                MaaN.backgroundElement.style.backgroundRepeat = 'repeat'
                break
            default:
                MaaN.backgroundElement.style.backgroundPosition = 'unset'
                MaaN.backgroundElement.style.backgroundRepeat = 'repeat'
                break
        }
    } else {
        switch (MaaN.config.ui.background.resize) {
            case "fill":
                MaaN.backgroundElement.style.backgroundSize = '100% 100%'
                break
            case "contain":
                MaaN.backgroundElement.style.backgroundSize = 'contain'
                break
            case "cover":
                MaaN.backgroundElement.style.backgroundSize = 'cover'
                break
            default:
                MaaN.backgroundElement.style.backgroundSize = 'auto'
                break
        }
        MaaN.backgroundElement.style.backgroundRepeat = 'no-repeat'
    }
}

MaaN.reloadFont = () => {
    document.body.style.setProperty('--font', MaaN.config.ui?.font)
}

MaaN.permanentStages = [
    {
        text: "1-7",
        value: "1-7"
    },
    {
        text: "R8-11",
        value: "R8-11"
    },
    {
        text: "12-17-HARD",
        value: "12-17-HARD"
    },
    {
        name: "AnnihilationMode",
        value: "Annihilation"
    }
]

MaaN.weeklyStages = [
    {
        code: ["CE-6"],
        name: "CETip",
        availability: [2, 4, 6, 0]
    },
    {
        code: ["AP-5"],
        name: "APTip",
        availability: [1, 4, 6, 0]
    },
    {
        code: ["CA-5"],
        name: "CATip",
        availability: [2, 3, 5, 0]
    },
    {
        code: ["LS-6"],
        name: "LSTip",
        availability: [1, 2, 3, 4, 5, 6, 0]
    },
    {
        code: ["SK-5"],
        name: "SKTip",
        availability: [1, 3, 5, 6]
    },
    {
        code: ["PR-A-1", "PR-A-2"],
        name: "PR-ATip",
        availability: [1, 4, 5, 0]
    },
    {
        code: ["PR-B-1", "PR-B-2"],
        name: "PR-BTip",
        availability: [1, 2, 5, 6]
    },
    {
        code: ["PR-C-1", "PR-C-2"],
        name: "PR-CTip",
        availability: [3, 4, 6, 0]
    },
    {
        code: ["PR-D-1", "PR-D-2"],
        name: "PR-DTip",
        availability: [2, 3, 6, 0]
    }
]

MaaN.timeZones = {
    "Official": 14400000,
    "Bilibili": 14400000,
    "YoStarEN": -39600000,
    "YoStarJP": 18000000,
    "YoStarKR": 18000000,
    "txwy": 14400000
}

MaaN.getWeeklyStages = () => {
    const serverDay = MaaN.getAdjustedServerDate().getUTCDay()
    return MaaN.weeklyStages.filter(stage => stage.availability.includes(serverDay))
}

MaaN.getAdjustedServerDate = () => new Date(Date.now() + MaaN.timeZones[MaaN.get('client_type')] ?? 0)

MaaN.getNextServerDayDate = (serverTime=MaaN.getAdjustedServerDate()) => {
    const result = new Date(serverTime)
    result.setUTCDate(result.getUTCDate() + 1)
    result.setUTCHours(0, 0, 0, -MaaN.timeZones[MaaN.get('client_type')])
    return result
}

MaaN.updateOpenStages = async () => {
    console.log('Updating Open Stages')
    const element = document.getElementById('FarmingScreenInfoText')
    if (!element) return
    let client_type = MaaN.get('client_type')
    if (client_type == 'txwy') client_type = 'Txwy'
    const weeklyStages = MaaN.get('config.profile.others.hide_unavailable_stages') ? MaaN.getWeeklyStages() : MaaN.weeklyStages
    const {stdOut} = await Neutralino.os.execCommand(MaaN.cliPath + 'activity ' + client_type)
    const stages = stdOut.split('\n').filter(line => line.startsWith('-')).map(line => line.split(':')[0].slice(2)).concat(MaaN.permanentStages, ...weeklyStages.map(stage => stage.code))
    MaaN.updateSelects('tasks.farming.Fight.params.stage', [{name: 'DefaultStage', value: undefined}, ...stages], 'stage')
    element.textContent = stdOut + MaaN.getText('TodaysStageTip') + '\n' + MaaN.getWeeklyStages().map(stage => MaaN.getText(stage.name)).join('\n')
}

MaaN.updateOpenStagesEveryHour = () => {
    MaaN.updateOpenStages()
    setTimeout(MaaN.updateOpenStagesEveryHour, 3600000)
}

MaaN.reloadUI = () => {
    const inInit = document.getElementById('InitScreen')?.classList?.contains('current')
    document.body.className = ''
    document.getElementById('_Main')?.remove()
    document.body.append(MaaN.render(MaaN.Screens, '_Main'))
    document.body.classList.add(MaaN.config.ui?.theme)
    document.body.classList.toggle('amoled_display', MaaN.config.ui?.amoled_dark)
    document.body.classList.toggle('transparent', MaaN.config.ui?.background?.transparency)
    if (MaaN.operBoxData) MaaN.updateOperBoxData(MaaN.operBoxData)
    if (MaaN.depotData) MaaN.updateDepotData(MaaN.depotData)
    document.getElementById(MaaN.screen + 'Screen').classList.add('current')
    MaaN.updateTitle()
    if (MaaN.get('client_type') && !inInit) {
        MaaN.updateOpenStages()
        MaaN.updateRoguelikeFromTheme(MaaN.get('tasks.farming.Roguelike.params.theme'))
    } else document.getElementById('InitScreen').classList.add('current')
    MaaN.log(MaaN.getText('CopilotTip'), undefined, 'copilot')
}

MaaN.bootAndroid = async () => {
    const emulator_path = MaaN.get('config.profile.startup.emulator_path')
    let execution
    switch (MaaN.profile.connection?.config) {
        case 'Waydroid':
            execution = await Neutralino.os.execCommand(MaaN.filePathHandler((emulator_path || 'waydroid')) + ' show-full-ui ' + (MaaN.get('config.profile.startup.emulator_arguments') ?? ''), {background: true})
            break
        default:
            if (!emulator_path) break
            execution = await Neutralino.os.execCommand(MaaN.filePathHandler(emulator_path) + ' ' + (MaaN.get('config.profile.startup.emulator_arguments') ?? ''), {background: true})
            break
    }
}

MaaN.getDevices = async () => {
    await Neutralino.os.execCommand(MaaN.filePathHandler(MaaN.get('profile.connection.adb_path')) + ' connect ' + (MaaN.get('profile.connection.address') ?? ''), {background: true})
    const execution = await Neutralino.os.execCommand(MaaN.filePathHandler(MaaN.get('profile.connection.adb_path')) + ' devices')
    if (execution.stdErr) MaaN.log(execution.stdErr.trim(), 'error')
    return execution.stdOut?.split('\n').filter(line => line.includes('\tdevice')).map(line => line.split('\t')[0])
}

MaaN.androidActions = {
    'BackToAndroidHome': async () => {
        const execution = await Neutralino.os.execCommand(MaaN.filePathHandler(MaaN.get('profile.connection.adb_path')) + ' exec-out am start -a android.intent.action.MAIN -c android.intent.category.HOME', {background: true})
    },
    'ExitEmulator': async () => {
        const emulator_path = MaaN.get('config.profile.startup.emulator_path')
        let execution
        switch (MaaN.profile.connection?.config) {
            case 'Waydroid':
                execution = await Neutralino.os.execCommand(MaaN.filePathHandler((emulator_path || 'waydroid')) + ' session stop', {background: true})
                break
            default:
                execution = await Neutralino.os.execCommand(MaaN.filePathHandler(MaaN.get('profile.connection.adb_path')) + ' exec-out reboot -p', {background: true})
                break
        }
    }
}

MaaN.selfActions = {
    'ExitSelf': async () => {
        await MaaN.exit()
    }
}

MaaN.systemActions = {
    'Reboot': async () => {
        let execution
        if (NL_OS == "Windows") {
            execution = await Neutralino.os.execCommand('shutdown /r /t 0')
        } else {
            execution = await Neutralino.os.execCommand('reboot')
        }
    },
    'Sleep': async () => {
        let execution
        switch (NL_OS) {
            case 'Windows':
                execution = await Neutralino.os.execCommand('rundll32.exe powrprof.dll,SetSuspendState 0,1,0')
                break
            case 'Darwin':
                execution = await Neutralino.os.execCommand('pmset sleepnow')
                break
            case 'Linux':
                execution = await Neutralino.os.execCommand('systemctl suspend')
                break
            default:
                execution = await Neutralino.os.execCommand('acpiconf -s 3')

        }
    },
    'Shutdown': async () => {
        let execution
        if (NL_OS == "Windows") {
            execution = await Neutralino.os.execCommand('shutdown /s /t 0')
        } else {
            execution = await Neutralino.os.execCommand('poweroff')
        }
    }
}

window.addEventListener('load', async () => {
    for (let i = 0; i < MaaN.locales.length; i++) {
        try {
            const xaml = await fetch('./MaaN/localization/' + MaaN.locales[i] + '.xaml')
            const text = await xaml.text()
            const data = Object.fromEntries([...text.matchAll(/<system:String x:Key="(.*?)"(?:.*?)>(.*?)<\/system:String>/gs)].map(([whole, key, value]) => [key, value]))
            MaaN.localization[MaaN.locales[i]] = data
        } catch (error) {
            console.error(error)
        }
        try {
            const json = await fetch('./MaaN/localization/custom/' + MaaN.locales[i] + '.json')
            const data = await json.json()
            Object.assign(MaaN.localization[MaaN.locales[i]], data, MaaN.localization[MaaN.locales[i]])
        } catch (error) {
            console.warn(error)
        }
    }
    MaaN.locked = true
    await MaaN.updatePath()
    await MaaN.loadConfig()
    if (MaaN.get('config.profile.startup.minimized')) Neutralino.window.minimize()
    if (MaaN.titleBar) document.body.append(MaaN.titleBar)
    if (MaaN.resizeAreas) MaaN.resizeAreas.forEach(resizeArea => document.body.append(resizeArea))
    document.body.append(MaaN.backgroundElement)
    MaaN.reloadFont()
    MaaN.reloadUI()
    MaaN.reloadBackground()
    if (MaaN.get('client_type')) {
        MaaN.unlock()
        if (MaaN.get('config.profile.startup.run_emulator') && !MaaN.get('config.profile.startup.retry_emulator')) await MaaN.bootAndroid()
        if (MaaN.get('config.profile.startup.run_tasks')) await MaaN.startTasks()
    } else document.getElementById('InitScreen').classList.add('current')
    if (MaaN.config.update?.auto_update) {
        MaaN.log(MaaN.getText('StartTask') + MaaN.getText('UpdateAutoDownload'))
        await MaaN.updateMaaCli()
        await MaaN.updateMaaCore()
        await MaaN.updatePath()
        await MaaN.updateMaaResource()
        MaaN.updateTitle()
        MaaN.log(MaaN.getText('CompleteTask') + MaaN.getText('UpdateAutoDownload'))
    }
    Neutralino.window.setIcon('./icons/app.png')
    const now = new Date()
    setTimeout(() => {
        MaaN.updateOpenStagesEveryHour()
    }, 3600000 - now.getUTCMinutes() * 60000 - now.getUTCSeconds() * 1000 - now.getUTCMilliseconds())
    MaaN.scheduleTasks()
    MaaN.updatePostActions()
})

return MaaN

})()