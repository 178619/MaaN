(()=>{

const touchModes = [
    {name: "MiniTouchMode", value: "MiniTouch"},
    {name: "MaaTouchMode", value: "MaaTouch"},
    {name: "AdbTouchMode", value: "ADB"}
]

if (NL_OS == 'Darwin') touchModes.push({name: "PlayToolsTouchMode", value: "MacPlayTools"})

const renderers = {
    config: (data) => {
        if (renderers[data.type]) return renderers[data.type](data)
        return null
    },
    button: (data) => {
        const node = document.createElement('button')
        node.textContent = MaaN.getText(data.name)
        if (data.events) Object.entries(data.events).forEach(([eventType, eventHandler]) => node.addEventListener(eventType, eventHandler))
        return node
    },
    div: (data) => {
        const node = document.createElement('div')
        node.textContent = MaaN.getText(data.name)
        if (data.events) Object.entries(data.events).forEach(([eventType, eventHandler]) => node.addEventListener(eventType, eventHandler))
        return node
    },
    link: (data) => {
        const node = document.createElement('a')
        node.textContent = MaaN.getText(data.name)
        node.addEventListener('click', () => {
            Neutralino.os.open(data.target.replaceAll('{locale}', MaaN.config.ui.language))
        })
        return node
    },
    checkbox: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.name = data.target.replace('{index}', data.index)
        if (data.disabled) checkbox.disabled = true
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        checkbox.addEventListener('click', () => {
            MaaN.set(checkbox.name, checkbox.checked)
            MaaN.updateInput(checkbox.name, checkbox.checked)
        })
        const config = MaaN.get(checkbox.name)
        checkbox.checked = config ?? false
        node.append(checkbox)
        node.append(textNode)
        return node
    },
    file: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        if (data.horizontal) node.classList.add('horizontal')
        const fileContainer = document.createElement('div')
        fileContainer.classList.add('file')
        const input = document.createElement('input')
        input.type = 'text'
        input.name = data.target.replace('{index}', data.index)
        if (data.disabled) input.disabled = true
        if (data.placeholder) input.placeholder = MaaN.getText(data.placeholder)
        const selector = document.createElement('button')
        selector.textContent = MaaN.getText('Select')
        if (data.disabled) selector.disabled = true
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        input.addEventListener('change', () => {
            MaaN.set(input.name, input.value)
            MaaN.updateInput(input.name, input.value)
        })
        selector.addEventListener('click', async () => {
            let path = (await Neutralino.os.showOpenDialog(MaaN.getText(data.name), data.path ? {defaultPath: MaaN.paths[data.path]} : undefined))[0]
            if (path === undefined) return
            if (path.includes(' ')) {
                if (NL_OS == 'Windows') path = '"' + path.replace(/[^\\]\\$/, '\\\\') + '"'
                if (NL_OS != 'Windows') path = "'" + path.replaceAll("'", "\\'") + "'"
            }
            MaaN.set(input.name, path)
            MaaN.updateInput(input.name, path)
        })
        node.addEventListener('drop', (event) => {
            event.preventDefault()
            if (event.dataTransfer.files && event.dataTransfer.files[0]) {
                console.log(event.dataTransfer.files[0])
            }
        })
        const config = MaaN.get(input.name)
        if (config) input.value = config
        node.append(textNode)
        fileContainer.append(input)
        fileContainer.append(selector)
        node.append(fileContainer)
        return node
    },
    listbox: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        if (data.disabled) checkbox.disabled = true
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        checkbox.addEventListener('click', () => {
            const config = MaaN.get(data.target) ?? []
            const list = new Set(config)
            checkbox.checked ? list.add(data.value) : list.delete(data.value)
            MaaN.set(data.target, Array.from(list))
        })
        const config = MaaN.get(data.target) ?? []
        checkbox.checked = config.includes(data.value)
        node.append(checkbox)
        node.append(textNode)
        return node
    },
    boxlist: (data) => {
        const indexes = {}
        data.data.forEach((itemData, index) => {
            indexes[itemData.value ?? itemData] = index
        })
        const node = document.createElement('div')
        node.classList.add('config')
        const textNode = document.createElement('div')
        if (data.name) textNode.textContent = MaaN.getText(data.name)
        const config = MaaN.get(data.target) ?? []
        const container = document.createElement('ol')
        data.data.forEach(itemData => {
            const value = itemData.value ?? itemData
            const item = document.createElement('li')
            const checkbox = document.createElement('input')
            checkbox.type = 'checkbox'
            checkbox.checked = config.includes(value)
            checkbox.name = value
            if (itemData.disabled) checkbox.disabled = true
            checkbox.addEventListener('click', () => {
                if (checkbox.checked) {
                    if (config.includes(value)) return
                    config.push(value)
                    MaaN.set(data.target, config.sort((a, b) => indexes[a] - indexes[b]))
                } else {
                    if (!config.includes(value)) return
                    config.splice(config.indexOf(value), 1)
                    MaaN.set(data.target, config)
                }
            })
            const itemTextNode = document.createElement('div')
            itemTextNode.textContent = itemData.text ?? MaaN.getText(itemData.name ?? itemData)
            item.append(checkbox)
            item.append(itemTextNode)
            container.append(item)
        })
        const buttonContainer = document.createElement('div')
        const buttonSelectAll = document.createElement('button')
        buttonSelectAll.textContent = MaaN.getText('SelectAll')
        buttonSelectAll.addEventListener('click', () => {
            config.splice(0, config.length, ...data.data.map(itemData => itemData.value ?? itemData))
            MaaN.set(data.target, config)
            container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = true
            })
        })
        const buttonClear = document.createElement('button')
        buttonClear.textContent = MaaN.getText('Clear')
        buttonClear.addEventListener('click', () => {
            config.length = 0
            MaaN.set(data.target, config)
            container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false
            })
        })
        buttonContainer.append(buttonSelectAll)
        buttonContainer.append(buttonClear)
        node.append(textNode)
        node.append(container)
        node.append(buttonContainer)
        return node
    },
    number: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        if (data.horizontal) node.classList.add('horizontal')
        const input = document.createElement('input')
        input.type = 'number'
        input.name = data.target.replace('{index}', data.index)
        if (data.disabled) input.disabled = true
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        input.addEventListener('change', () => {
            MaaN.set(input.name, parseInt(input.value))
            MaaN.updateInput(input.name, input.value)
        })
        const config = MaaN.get(input.name)
        if (config || config === 0) input.value = config
        node.append(textNode)
        node.append(input)
        return node
    },
    range: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        if (data.horizontal) node.classList.add('horizontal')
        const input = document.createElement('input')
        input.type = 'range'
        input.name = data.target.replace('{index}', data.index)
        input.min = 0
        input.max = 1
        input.step = 0.01
        if (data.disabled) input.disabled = true
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        input.addEventListener('input', () => {
            textNode.textContent = MaaN.getText(data.name) + ': ' + Math.round(input.value * 100).toString() + '%'
        })
        input.addEventListener('change', () => {
            MaaN.set(input.name, parseFloat(input.value))
            MaaN.updateInput(input.name, parseFloat(input.value))
        })
        const config = MaaN.get(input.name)
        if (config || config === 0) {
            input.value = config
            textNode.textContent = MaaN.getText(data.name) + ': ' + Math.round(config * 100).toString() + '%'
        }
        node.append(textNode)
        node.append(input)
        return node
    },
    select: (data) => {
        const node = document.createElement('div')
        node.classList.add('config')
        if (data.horizontal) node.classList.add('horizontal')
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        const dropdown = document.createElement('input')
        dropdown.readOnly = true
        dropdown.type = 'text'
        dropdown.name = data.target.replace('{index}', data.index)
        dropdown.classList.add('dropdown')
        if (data.disabled) dropdown.disabled = true
        const select = document.createElement('ul')
        const config = MaaN.get(dropdown.name)
        const selected = data.options.find((dat) => config === dat || (config === dat.value && (dat.text || dat.name)))
        data.options?.forEach((dat) => {
            const name = dat.name ?? dat
            const value = (dat.name || dat.text) ? dat.value : dat
            const option = document.createElement('li')
            option.textContent = dat.text ?? MaaN.getText(name)
            option.addEventListener('click', () => {
                MaaN.set(dropdown.name, value)
                MaaN.updateInput(dropdown.name, option.textContent)
            })
            if (selected == value || selected && selected.value == value) option.classList.add('selected')
            select.append(option)
        })
        dropdown.value = MaaN.getText(selected?.text ?? selected?.name ?? selected ?? config ?? 'NotSelected')
        node.append(textNode)
        node.append(dropdown)
        node.append(select)
        return node
    },
    text: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        if (data.horizontal) node.classList.add('horizontal')
        const input = document.createElement('input')
        input.type = 'text'
        input.name = data.target.replace('{index}', data.index)
        if (data.placeholder) input.placeholder = MaaN.getText(data.placeholder)
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        input.addEventListener('change', () => {
            MaaN.set(input.name, input.value)
            MaaN.updateInput(input.name, input.value)
        })
        const config = MaaN.get(input.name)
        if (config) input.value = config
        node.append(textNode)
        node.append(input)
        return node
    },
    textlist: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        if (data.horizontal) node.classList.add('horizontal')
        const input = document.createElement('input')
        input.type = 'text'
        input.name = data.target.replace('{index}', data.index)
        if (data.placeholder) input.placeholder = MaaN.getText(data.placeholder)
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        input.addEventListener('change', () => {
            MaaN.set(input.name, input.value.split(/;|；/g))
            MaaN.updateInput(input.name, input.value.split(/;|；/g).join(';'))
        })
        const config = MaaN.get(input.name) ?? []
        if (config) input.value = config.join(';')
        node.append(textNode)
        node.append(input)
        return node
    },
    time: (data) => {
        const node = document.createElement('label')
        node.classList.add('config')
        if (data.horizontal) node.classList.add('horizontal')
        const input = document.createElement('input')
        input.type = 'time'
        input.name = data.target.replace('{index}', data.index)
        if (data.placeholder) input.placeholder = MaaN.getText(data.placeholder)
        const textNode = document.createElement('div')
        textNode.textContent = MaaN.getText(data.name)
        input.addEventListener('change', () => {
            MaaN.set(input.name, input.value)
            MaaN.updateInput(input.name, input.value)
        })
        const config = MaaN.get(input.name)
        if (config) input.value = config
        node.append(textNode)
        node.append(input)
        return node
    },
    list: (data) => {
        const node = document.createElement('div')
        node.classList.add('config')
        const textNode = document.createElement('div')
        if (data.name) textNode.textContent = MaaN.getText(data.name)
        const config = MaaN.get(data.target) ?? []
        const button = document.createElement('button')
        button.textContent = MaaN.getText('UserAdditional.Add')
        const container = document.createElement('ol')
        config.forEach((value, index) => {
            const item = document.createElement('li')
            data.data.forEach(itemData => {
                const input = renderers.config({...itemData, index})
                item.append(input)
            })
            const buttonRemove = document.createElement('button')
            buttonRemove.textContent = '✕'
            buttonRemove.addEventListener('click', () => {
                config.splice(index, 1)
                MaaN.set(data.target, config)
                MaaN.updateList(container, data)
            })
            item.append(buttonRemove)
            container.append(item)
        })
        button.addEventListener('click', () => {
            config.push(data.default)
            MaaN.set(data.target, config)
            MaaN.updateList(container, data)
        })
        textNode.append(button)
        node.append(textNode)
        node.append(container)
        return node
    }
}

MaaN.updateSelects = (nodeName, options) => {
    document.querySelectorAll('.config .dropdown[name="' + nodeName + '"] + ul').forEach(select => {
        select.innerHTML = ''
        const config = MaaN.get(nodeName)
        const selected = options.find((dat) => config === dat || (config === dat.value && (dat.text || dat.name)))
        options?.forEach((dat) => {
            const name = dat.name ?? dat
            const value = (dat.name || dat.text) ? dat.value : dat
            const option = document.createElement('li')
            option.textContent = dat.text ?? MaaN.getText(name)
            option.addEventListener('click', () => {
                MaaN.set(nodeName, value)
                MaaN.updateInput(nodeName, option.textContent)
            })
            if (selected == value || selected && selected.value == value) option.classList.add('selected')
            select.append(option)
        })
    })
}

MaaN.updateList = (container, data) => {
    container.innerHTML = ''
    const config = MaaN.get(data.target) ?? []
    config.forEach((value, index) => {
        const item = document.createElement('li')
        data.data.forEach(itemData => {
            const input = renderers.config({...itemData, index})
            item.append(input)
        })
        const buttonRemove = document.createElement('button')
        buttonRemove.textContent = '✕'
        buttonRemove.addEventListener('click', () => {
            config.splice(index, 1)
            MaaN.set(data.target, config)
            MaaN.updateList(container, data)
        })
        item.append(buttonRemove)
        container.append(item)
    })
}

MaaN.Screens = {
    _Main: {
        list: [
            "TopMenu",
            "FarmingScreen",
            "CopilotScreen",
            "ToolboxScreen",
            "SettingsScreen",
            "InitScreen",
            "SystemScreen"
        ]
    },
    TopMenu: {
        node: "nav",
        list: [
            "Farming",
            "Copilot",
            "Toolbox",
            "Settings"
        ],
        renderer: (name) => {
            const id = 'TopMenu' + name
            const node = document.createElement('button')
            node.id = id
            node.textContent = MaaN.getText(name)
            if (MaaN.screen == name) node.classList.add('selected')
            node.addEventListener('click', () => {
                if (MaaN.screen == 'Init' || MaaN.screen == 'System') return
                document.getElementById('TopMenu' + MaaN.screen)?.classList.remove('selected')
                node.classList.add('selected')
                document.getElementById(MaaN.screen + 'Screen').classList.remove('current')
                document.getElementById(name + 'Screen').classList.add('current')
                MaaN.screen = name
            })
            return node
        }
    },
    FarmingScreen: {
        list: [
            "FarmingScreenMain",
            "FarmingScreenInfo",
            "FarmingScreenLogs"
        ],
        renderer: (name) => {
            return MaaN.render(MaaN.ScreensCat.Farming, name)
        }
    },
    CopilotScreen: {
        list: [
            "CopilotScreenSelector",
            "CopilotScreenLogs"
        ],
        renderer: (name) => {
            return MaaN.render(MaaN.ScreensCat.Copilot, name)
        }
    },
    ToolboxScreen: {
        list: [
            "ToolboxScreenNav",
            "ToolboxScreenMain"
        ],
        renderer: (name) => {
            return MaaN.render(MaaN.ScreensCat.Toolbox, name)
        }
    },
    SettingsScreen: {
        list: [
            "SettingsScreenList",
            "SettingsScreenMain"
        ],
        renderer: (name) => {
            return MaaN.render(MaaN.ScreensCat.Settings, name)
        }
    },
    InitScreen: {
        list: [
            "InitScreenConfig",
            "InitScreenList"
        ]
    },
    InitScreenConfig: {
        list: [
            {
                type: "select",
                name: "Language",
                target: "config.ui.language",
                options: [{name: "LanguageZhCN", value: "zh-cn"}, {name: "LanguageZhTW", value: "zh-tw"}, {name: "LanguageEnUS", value: "en-us"}, {name: "LanguageJaJP", value: "ja-jp"}, {name: "LanguageKoKR", value: "ko-kr"}]
            },
            {
                type: "select",
                name: "ClientType",
                target: "client_type",
                options: ["Official", "Bilibili", "YoStarEN", "YoStarJP", "YoStarKR", {name: "Txwy", value: "txwy"}]
            },
            {
                type: "file",
                name: "AdbPath",
                target: "profile.connection.adb_path"
            },
            {
                type: "text",
                name: "ConnectionAddress",
                target: "profile.connection.address"
            },
            {
                type: "select",
                name: "TouchMode",
                target: "profile.instance_options.touch_mode",
                options: touchModes
            }
        ],
        renderer: renderers.config
    },
    InitScreenList: {
        list: [
            "InitScreenListButton"
        ],
        renderer: (name) => {
            const node = document.createElement('button')
            node.id = name
            node.textContent = MaaN.getText('Start')
            node.addEventListener('click', () => {
                if (!MaaN.get('client_type')) {
                    document.querySelector('#InitScreen .dropdown[name="client_type"]').focus()
                    return
                }
                document.getElementById('InitScreen').classList.remove('current')
                MaaN.reloadUI()
                MaaN.unlock()
            })
            return node
        }
    },
    SystemScreen: {
        list: [
            "SystemScreenMain",
        ]
    },
    SystemScreenMain: {
        list: [
            // "SystemScreenMainTitle",
            "SystemScreenMainText",
            "SystemScreenMainVisual",
            "SystemScreenMainButton"
        ]
    },
    SystemScreenMainTitle: {
        name: "ShutdownPrompt"
    },
    SystemScreenMainText: {
        name: "AboutToShutdown"
    },
    SystemScreenMainVisual: {
        list: [
            "SystemScreenMainVisualProgress"
        ]
    },
    SystemScreenMainVisualProgress: {
    },
    SystemScreenMainButton: {
        list: [
            "SystemScreenMainButtonCancel",
            "SystemScreenMainButtonConfirm"
        ]
    },
    SystemScreenMainButtonCancel: {
        node: "button",
        name: "Cancel",
        events: {
            click: () => {
                if (!MaaN.scheduleSystemAction) {
                    document.getElementById('SystemScreen').classList.remove('current')
                    return
                }
                const {id} = MaaN.scheduleSystemAction
                clearTimeout(id)
                document.getElementById('SystemScreen').classList.remove('current')
                MaaN.updatePostActions()
                MaaN.scheduleSystemAction = null
            }
        }
    },
    SystemScreenMainButtonConfirm: {
        node: "button",
        name: "Confirm",
        events: {
            click: async () => {
                if (!MaaN.scheduleSystemAction) {
                    document.getElementById('SystemScreen').classList.remove('current')
                    return
                }
                const {id, action} = MaaN.scheduleSystemAction
                clearTimeout(id)
                document.getElementById('SystemScreen').classList.remove('current')
                MaaN.updatePostActions()
                await action()
                MaaN.scheduleSystemAction = null
            }
        }
    }
}

MaaN.ScreensCat = {
    Farming: {
        FarmingScreenMain: {
            list: [
                "FarmingScreenMainBox",
                "FarmingScreenMainAfter",
                "FarmingScreenMainStart"
            ]
        },
        FarmingScreenMainBox: {
            list: [
                "FarmingScreenMainBoxList",
                "FarmingScreenMainBoxButtons",
            ]
        },
        FarmingScreenMainBoxList: {
            node: "ol",
            list: [
                "StartUp",
                "Recruit",
                "Infrast",
                "Fight",
                "Mall",
                "Award",
                "Roguelike",
                "Reclamation"
            ],
            renderer: (name) => {
                const id = 'FarmingScreenMainBoxListItem' + name
                const node = document.createElement('li')
                node.id = id
                const checkbox = document.createElement('input')
                checkbox.type = 'checkbox'
                checkbox.name = 'tasks.farming.'+name+'.params.enable'
                const textNode = document.createElement('div')
                textNode.textContent = MaaN.getText(name)
                const configButton = document.createElement('button')
                node.addEventListener('click', (e) => {
                    if (e.target == configButton) return
                    if (e.target != checkbox) checkbox.checked = !checkbox.checked
                    MaaN.set('tasks.farming.'+name+'.params.enable', checkbox.checked)
                })
                configButton.addEventListener('click', () => {
                    document.getElementById('FarmingScreenMainBoxListItem' + MaaN.route.Farming[0])?.classList.remove('selected')
                    document.getElementById('FarmingScreenMainAfterButton').classList.remove('selected')
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'General')?.classList.remove('current')
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'Advanced')?.classList.remove('current')
                    document.getElementById('FarmingScreenInfoConfig' + name + 'General').classList.add('current')
                    document.getElementById('FarmingScreenInfoChooseExtra').classList.remove('selected')
                    document.getElementById('FarmingScreenInfoChooseBasic').classList.add('selected')
                    node.classList.add('selected')
                    MaaN.route.Farming[0] = name
                })
                const config = MaaN.get('tasks.farming.'+name+'.params.enable')
                checkbox.checked = config ?? false
                node.append(checkbox)
                node.append(textNode)
                node.append(configButton)
                return node
            }
        },
        FarmingScreenMainBoxButtons: {
            list: [
                "FarmingScreenMainBoxButtonsLeft",
                "FarmingScreenMainBoxButtonsRight",
            ]
        },
        FarmingScreenMainBoxButtonsLeft: {
            node: "button",
            name: "SelectAll",
            events: {
                click: () => {
                    [
                        "StartUp",
                        "Recruit",
                        "Infrast",
                        "Fight",
                        "Mall",
                        "Award"
                    ].forEach(name => {
                        MaaN.set('tasks.farming.' + name + '.params.enable', true)
                        MaaN.updateInput('tasks.farming.' + name + '.params.enable', true)
                    })
                }
            }
        },
        FarmingScreenMainBoxButtonsRight: {
            node: "button",
            name: "Clear",
            events: {
                click: () => {
                    [
                        "StartUp",
                        "Recruit",
                        "Infrast",
                        "Fight",
                        "Mall",
                        "Award",
                        "Roguelike",
                        "Reclamation"
                    ].forEach(name => {
                        MaaN.set('tasks.farming.' + name + '.params.enable', false)
                        MaaN.updateInput('tasks.farming.' + name + '.params.enable', false)
                    })
                }
            }
        },
        FarmingScreenMainAfter: {
            list: [
                "FarmingScreenMainAfterInfo",
                "FarmingScreenMainAfterButton"
            ]
        },
        FarmingScreenMainAfterInfo: {
            list: [
                "FarmingScreenMainAfterInfoText",
                "FarmingScreenMainAfterInfoDevider",
                "FarmingScreenMainAfterInfoBehaviour"
            ]
        },
        FarmingScreenMainAfterInfoText: {
            name: "PostActions"
        },
        FarmingScreenMainAfterInfoDevider: {
            node: "hr"
        },
        FarmingScreenMainAfterInfoBehaviour: {
            name: "DoNothing"
        },
        FarmingScreenMainAfterButton: {
            node: "button",
            events: {
                click: () => {
                    document.getElementById('FarmingScreenMainBoxListItem' + MaaN.route.Farming[0])?.classList.remove('selected')
                    document.getElementById('FarmingScreenMainAfterButton').classList.add('selected')
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'General')?.classList.remove('current')
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'Advanced')?.classList.remove('current')
                    document.getElementById('FarmingScreenInfoConfigAfterGeneral').classList.add('current')
                    document.getElementById('FarmingScreenInfoChooseExtra').classList.remove('selected')
                    document.getElementById('FarmingScreenInfoChooseBasic').classList.add('selected')
                    MaaN.route.Farming[0] = 'After'
                }
            }
        },
        FarmingScreenMainStart: {
            list: [
                "FarmingScreenMainStartButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'LinkStart'
                node.textContent = MaaN.getText(MaaN.currentSession ? 'Stop' : node.name)
                node.disabled = true
                node.classList.add('startbutton')
                node.addEventListener('click', () => {MaaN.startOrStopTasks()})
                return node
            }
        },
        FarmingScreenInfo: {
            list: [
                "FarmingScreenInfoConfig",
                "FarmingScreenInfoChoose",
                "FarmingScreenInfoText"
            ]
        },
        FarmingScreenInfoConfig: {
            list: [
                "FarmingScreenInfoConfigStartUpGeneral",
                "FarmingScreenInfoConfigRecruitGeneral",
                "FarmingScreenInfoConfigInfrastGeneral",
                "FarmingScreenInfoConfigFightGeneral",
                "FarmingScreenInfoConfigMallGeneral",
                "FarmingScreenInfoConfigAwardGeneral",
                "FarmingScreenInfoConfigRoguelikeGeneral",
                "FarmingScreenInfoConfigReclamationGeneral",
                "FarmingScreenInfoConfigAfterGeneral",
                "FarmingScreenInfoConfigRecruitAdvanced",
                "FarmingScreenInfoConfigInfrastAdvanced",
                "FarmingScreenInfoConfigFightAdvanced",
                "FarmingScreenInfoConfigMallAdvanced",
                "FarmingScreenInfoConfigRoguelikeAdvanced"
            ]
        },
        FarmingScreenInfoConfigStartUpGeneral: {
            list: [
                {
                    type: "select",
                    name: "ClientType",
                    target: "client_type",
                    options: ["Official", "Bilibili", "YoStarEN", "YoStarJP", "YoStarKR", {name: "Txwy", value: "txwy"}],
                    horizontal: true
                },
                {
                    type: "checkbox",
                    name: "StartGameLaunchClient",
                    target: "tasks.farming.StartUp.params.start_game_enabled"
                },
                {
                    type: "file",
                    name: "AdbPath",
                    target: "profile.connection.adb_path"
                },
                {
                    type: "text",
                    name: "ConnectionAddress",
                    target: "profile.connection.address"
                },
                {
                    type: "select",
                    name: "ConnectionPreset",
                    target: "profile.connection.config",
                    options: ["General", "BlueStacks", "MuMuEmulator12", "LDPlayer", "Nox", "XYAZ", "WSA", "Compatible", "SecondResolution", "GeneralWithoutScreencapErr", "CompatMac", "CompatPOSIXShell", "Waydroid"]
                },
                {
                    type: "select",
                    name: "TouchMode",
                    target: "profile.instance_options.touch_mode",
                    options: touchModes
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigRecruitGeneral: {
            list: [
                {
                    type: "checkbox",
                    name: "AutoUseExpedited",
                    target: "tasks.farming.Recruit.params.expedite"
                },
                {
                    type: "number",
                    name: "RecruitMaxTimes",
                    target: "tasks.farming.Recruit.params.times",
                    horizontal: true
                },
                {
                    type: "checkbox",
                    name: "AutoRefresh",
                    target: "tasks.farming.Recruit.params.refresh"
                },
                {
                    type: "checkbox",
                    name: "ManuallySelectLevel1",
                    target: "tasks.farming.Recruit.params.skip_robot"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigRecruitAdvanced: {
            list: [
                {
                    type: "select",
                    name: "AutoRecruitSelectStrategy",
                    target: "tasks.farming.Recruit.params.extra_tags_mode",
                    options: [{name: "DefaultNoExtraTags", value: 0}, {name: "SelectExtraTags", value: 1}, {name: "SelectExtraOnlyRareTags", value: 2}]
                },
                {
                    type: "listbox",
                    name: "AutoSelectLevel3",
                    target: "tasks.farming.Recruit.params.confirm",
                    value: 3
                },
                {
                    type: "listbox",
                    name: "AutoSelectLevel4",
                    target: "tasks.farming.Recruit.params.confirm",
                    value: 4
                },
                {
                    type: "listbox",
                    name: "AutoSelectLevel5",
                    target: "tasks.farming.Recruit.params.confirm",
                    value: 5
                },
                {
                    type: "listbox",
                    name: "AutoSelectLevel6",
                    target: "tasks.farming.Recruit.params.confirm",
                    value: 6,
                    disabled: true
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigInfrastGeneral: {
            list: [
                {
                    type: "select",
                    name: "InfrastMode",
                    target: "tasks.farming.Infrast.params.mode",
                    options: [{name: "InfrastModeNormal", value: 0}, {name: "InfrastModeRotation", value: 20000}/* , {name: "InfrastModeCustom", value: 10000} */]
                },
                {
                    type: "select",
                    name: "DroneUsage",
                    target: "tasks.farming.Infrast.params.drones",
                    options: [{name: "DronesNotUse", value: "_NotUse"}, {name: "Money", value: "Money"}, {name: "SyntheticJade", value: "SyntheticJade"}, {name: "CombatRecord", value: "CombatRecord"}, {name: "PureGold", value: "PureGold"}, {name: "OriginStone", value: "OriginStone"}, {name: "Chip", value: "Chip"}]
                },
                {
                    type: "range",
                    name: "DormThreshold",
                    target: "tasks.farming.Infrast.params.threshold"
                },
                {
                    type: "boxlist",
                    target: "tasks.farming.Infrast.params.facility",
                    data: [
                        "Mfg",
                        "Trade",
                        "Control",
                        "Power",
                        "Reception",
                        "Office",
                        "Dorm",
                        "Processing",
                        "Training"
                    ]
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigInfrastAdvanced: {
            list: [
                {
                    type: "checkbox",
                    name: "DormTrustEnabled",
                    target: "tasks.farming.Infrast.params.dorm_trust_enabled"
                },
                {
                    type: "checkbox",
                    name: "DormFilterNotStationedEnabled",
                    target: "tasks.farming.Infrast.params.dorm_notstationed_enabled"
                },
                {
                    type: "checkbox",
                    name: "OriginiumShardAutoReplenishment",
                    target: "tasks.farming.Infrast.params.replenish"
                },
                {
                    type: "checkbox",
                    name: "InfrastReceptionMessageBoardReceive",
                    target: "tasks.farming.Infrast.params.reception_message_board"
                },
                {
                    type: "checkbox",
                    name: "InfrastReceptionClueExchange",
                    target: "tasks.farming.Infrast.params.reception_clue_exchange"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigFightGeneral: {
            list: [
                {
                    type: "number",
                    name: "UseSanityPotion",
                    target: "tasks.farming.Fight.params.medicine",
                    horizontal: true
                },
                {
                    type: "number",
                    name: "UseOriginitePrime",
                    target: "tasks.farming.Fight.params.stone",
                    horizontal: true
                },
                {
                    type: "number",
                    name: "PerformBattles",
                    target: "tasks.farming.Fight.params.times",
                    horizontal: true
                },
                {
                    type: "select",
                    name: "Series",
                    target: "tasks.farming.Fight.params.series", 
                    options: [{name: "NotSwitch", value: -1}, {name: "Auto", value: 0}, 1, 2, 3, 4, 5, 6],
                    horizontal: true
                },
                {
                    type: "select",
                    name: "StageSelect",
                    target: "tasks.farming.Fight.params.stage", 
                    options: [{name: "DefaultStage", value: undefined}, "1-7", {text: "R8-11", value: "R8-11"}, {text: "12-17-HARD", value: "12-17-HARD"}],
                    horizontal: true
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigFightAdvanced: {
            list: [
                {
                    type: "number",
                    name: "ExpiringMedicine",
                    target: "tasks.farming.Fight.params.expiring_medicine",
                    horizontal: true
                },
                {
                    type: "checkbox",
                    name: "DrGrandet",
                    target: "tasks.farming.Fight.params.DrGrandet"
                },
                {
                    type: "checkbox",
                    name: "HideUnavailableStage",
                    target: "config.profile.others.hide_unavailable_stages"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigMallGeneral: {
            list: [
                {
                    type: "checkbox",
                    name: "Visiting",
                    target: "tasks.farming.Mall.params.visit_friends"
                },
                {
                    type: "checkbox",
                    name: "SocialPtShop",
                    target: "tasks.farming.Mall.params.shopping"
                },
                {
                    type: "checkbox",
                    name: "CreditFight",
                    target: "tasks.farming.Mall.params.credit_fight"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigMallAdvanced: {
            list: [
                {
                    type: "textlist",
                    name: "HighPriority",
                    target: "tasks.farming.Mall.params.buy_first"
                },
                {
                    type: "textlist",
                    name: "Blacklist",
                    target: "tasks.farming.Mall.params.blacklist"
                },
                {
                    type: "checkbox",
                    name: "ForceShoppingIfCreditFull",
                    target: "tasks.farming.Mall.params.force_shopping_if_credit_full"
                },
                {
                    type: "checkbox",
                    name: "OnlyBuyDiscount",
                    target: "tasks.farming.Mall.params.only_buy_discount"
                },
                {
                    type: "checkbox",
                    name: "ReserveMaxCredit",
                    target: "tasks.farming.Mall.reserve_max_credit.visit_friends"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigAwardGeneral: {
            list: [
                {
                    type: "checkbox",
                    name: "ReceiveDailyAndWeeklyAward",
                    target: "tasks.farming.Award.params.award"
                },
                {
                    type: "checkbox",
                    name: "ReceiveMail",
                    target: "tasks.farming.Award.params.mail"
                },
                {
                    type: "checkbox",
                    name: "ReceiveFreeGacha",
                    target: "tasks.farming.Award.params.recruit"
                },
                {
                    type: "checkbox",
                    name: "ReceiveOrundum",
                    target: "tasks.farming.Award.params.orundum"
                },
                {
                    type: "checkbox",
                    name: "ReceiveMining",
                    target: "tasks.farming.Award.params.mining"
                },
                {
                    type: "checkbox",
                    name: "ReceiveSpecialAccess",
                    target: "tasks.farming.Award.params.specialaccess"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigRoguelikeGeneral: {
            list: [
                {
                    type: "select",
                    name: "RoguelikeTheme",
                    target: "tasks.farming.Roguelike.params.theme",
                    options: [{name: "RoguelikeThemePhantom", value: "Phantom"}, {name: "RoguelikeThemeMizuki", value: "Mizuki"}, {name: "RoguelikeThemeSami", value: "Sami"}, {name: "RoguelikeThemeSarkaz", value: "Sarkaz"}, {name: "RoguelikeThemeJieGarden", value: "JieGarden"}],
                    horizontal: true
                },
                {
                    type: "select",
                    name: "RoguelikeDifficulty",
                    target: "tasks.farming.Roguelike.params.difficulty",
                    options: [{name: "NotSwitch", value: -1}, {name: "Max", value: 0x7FFFFFFF}, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
                    horizontal: true
                },
                {
                    type: "select",
                    name: "Strategy",
                    target: "tasks.farming.Roguelike.params.mode",
                    options: [{name: "RoguelikeStrategyExp", value: 0}, {name: "RoguelikeStrategyGold", value: 1}, {name: "RoguelikeStrategyLastReward", value: 4}, {name: "RoguelikeStrategyCollapse", value: 5}, {name: "RoguelikeStrategyMonthlySquad", value: 6}, {name: "RoguelikeStrategyDeepExploration", value: 7}]
                },
                {
                    type: "select",
                    name: "StartingSquad",
                    target: "tasks.farming.Roguelike.params.squad",
                    options: [{name: "GatheringSquad", value: "集群分队"}, {name: "SpearheadSquad", value: "矛头分队"}, {name: "ResearchSquad", value: "研究分队"}, {name: "LeaderSquad", value: "指挥分队"}, {name: "SupportSquad", value: "后勤分队"}, {name: "TacticalAssaultOperative", value: "突击战术分队"}, {name: "TacticalFortificationOperative", value: "堡垒战术分队"}, {name: "TacticalRangedOperative", value: "远程战术分队"}, {name: "TacticalDestructionOperative", value: "破坏战术分队"}, {name: "First-ClassSquad", value: "高规格分队"}, {name: "SpecialForceSquad", value: "特勤分队"}, {name: "IS2NewSquad1", value: "心胜于物分队"}, {name: "IS2NewSquad2", value: "物尽其用分队"}, {name: "IS2NewSquad3", value: "以人为本分队"}, {name: "IS3NewSquad1", value: "永恒狩猎分队"}, {name: "IS3NewSquad2", value: "生活至上分队"}, {name: "IS3NewSquad3", value: "科学主义分队"}, {name: "IS4NewSquad1", value: "魂灵护送分队"}, {name: "IS4NewSquad2", value: "博闻广记分队"}, {name: "IS4NewSquad3", value: "蓝图测绘分队"}, {name: "IS4NewSquad4", value: "因地制宜分队"}, {name: "IS4NewSquad5", value: "异想天开分队"}, {name: "IS4NewSquad6", value: "点刺成锭分队"}, {name: "IS4NewSquad7", value: "拟态学者分队"}, {name: "IS4NewSquad8", value: "专业人士分队"}, {name: "IS5NewSquad1", value: "高台突破分队"}, {name: "IS5NewSquad2", value: "地面突破分队"}, {name: "IS5NewSquad3", value: "游客分队"}, {name: "IS5NewSquad4", value: "司岁台分队"}, {name: "IS5NewSquad5", value: "天师府分队"}, {name: "IS5NewSquad6", value: "花团锦簇分队"}, {name: "IS5NewSquad7", value: "棋行险着分队"}, {name: "IS5NewSquad8", value: "岁影回音分队"}]
                },
                {
                    type: "select",
                    name: "StartingRoles",
                    target: "tasks.farming.Roguelike.params.roles",
                    options: [{name: "FirstMoveAdvantage", value: "先手必胜"}, {name: "SlowAndSteadyWinsTheRace", value: "稳扎稳打"}, {name: "OvercomingYourWeaknesses", value: "取长补短"}, {name: "FlexibleDeployment", value: "灵活部署"}, {name: "Unbreakable", value: "坚不可摧"}, {name: "AsYourHeartDesires", value: "随心所欲"}]
                },
                {
                    type: "number",
                    name: "StartTimesLimit",
                    target: "tasks.farming.Roguelike.params.starts_count"
                },
                {
                    type: "checkbox",
                    name: "InvestmentEnabled",
                    target: "tasks.farming.Roguelike.params.investment_enabled"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigRoguelikeAdvanced: {
            list: [
                {
                    type: "checkbox",
                    name: "StopOnGoldLimit",
                    target: "tasks.farming.Roguelike.params.stop_when_investment_full"
                },
                {
                    type: "number",
                    name: "GoldTimesLimit",
                    target: "tasks.farming.Roguelike.params.investments_count"
                },
                {
                    type: "checkbox",
                    name: "RoguelikeStopAtFinalBoss",
                    target: "tasks.farming.Roguelike.params.stop_at_final_boss"
                },
                {
                    type: "checkbox",
                    name: "RoguelikeStopAtMaxLevel",
                    target: "tasks.farming.Roguelike.params.stop_at_max_level"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigReclamationGeneral: {
            list: [
                {
                    type: "select",
                    name: "ReclamationTheme",
                    target: "tasks.farming.Reclamation.params.theme",
                    options: [{name: "ReclamationThemeFire", value: "Fire"}, {name: "ReclamationThemeTales", value: "Tales"}]
                },
                {
                    type: "select",
                    name: "Strategy",
                    target: "tasks.farming.Reclamation.params.mode",
                    options: [{name: "ReclamationModeProsperityNoSave", value: 0}, {name: "ReclamationModeProsperityInSave", value: 1}]
                },
                {
                    type: "div",
                    name: "ReclamationEarlyTip"
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoConfigAfterGeneral: {
            list: [
                {
                    type: "checkbox",
                    name: "Once",
                    target: "config.profile.post_actions.only_once"
                },
                {
                    type: "checkbox",
                    name: "ExitArknights",
                    target: "tasks.farming.CloseDown.params.enable"
                },
                {
                    type: "select",
                    name: "Android",
                    target: "config.profile.post_actions.client",
                    options: ["DoNothing", "BackToAndroidHome", "ExitEmulator"],
                    horizontal: true
                },
                {
                    type: "select",
                    name: "SelfName",
                    target: "config.profile.post_actions.self",
                    options: ["DoNothing", "ExitSelf"],
                    horizontal: true
                },
                {
                    type: "select",
                    name: "System",
                    target: "config.profile.post_actions.os",
                    options: ["DoNothing", "Sleep", "Shutdown"],
                    horizontal: true
                }
            ],
            renderer: renderers.config
        },
        FarmingScreenInfoChoose: {
            list: [
                "FarmingScreenInfoChooseBasic",
                "FarmingScreenInfoChooseExtra"
            ]
        },
        FarmingScreenInfoChooseBasic: {
            node: "button",
            name: "GeneralSettings",
            events: {
                click: () => {
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'Advanced')?.classList.remove('current')
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'General')?.classList.add('current')
                    document.getElementById('FarmingScreenInfoChooseExtra').classList.remove('selected')
                    document.getElementById('FarmingScreenInfoChooseBasic').classList.add('selected')
                    MaaN.route.Farming[1] = 'General'
                }
            }
        },
        FarmingScreenInfoChooseExtra: {
            node: "button",
            name: "AdvancedSettings",
            events: {
                click: () => {
                    if (!document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'Advanced')) return
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'General')?.classList.remove('current')
                    document.getElementById('FarmingScreenInfoConfig' + MaaN.route.Farming[0] + 'Advanced')?.classList.add('current')
                    document.getElementById('FarmingScreenInfoChooseBasic').classList.remove('selected')
                    document.getElementById('FarmingScreenInfoChooseExtra').classList.add('selected')
                    MaaN.route.Farming[1] = 'Advanced'
                }
            }
        },
        FarmingScreenInfoText: {
            name: "TodaysStageTip"
        },
        FarmingScreenLogs: {}
    },
    Copilot: {
        CopilotScreenSelector: {
            list: [
                "CopilotScreenSelectorNav",
                "CopilotScreenSelectorFile",
                "CopilotScreenSelectorStart",
                "CopilotScreenSelectorConfig"
            ]
        },
        CopilotScreenSelectorNav: {
            node: "nav",
            list: [
                "MainStageStoryCollectionSideStory",
                "SSS",
                "ParadoxSimulation",
                "OtherActivityStage"
            ],
            renderer: (name) => {
                const id = 'CopilotScreenSelectorNav' + name
                const node = document.createElement('button')
                node.id = id
                node.textContent = MaaN.getText(name)
                if (MaaN.screen == name) node.classList.add('selected')
                node.addEventListener('click', () => {
                    document.getElementById('CopilotScreenSelectorNav' + MaaN.route.Copilot[0])?.classList.remove('selected')
                    document.getElementById('CopilotScreenSelectorConfig' + MaaN.route.Copilot[0])?.classList.remove('current')
                    document.getElementById('CopilotScreenSelectorConfig' + name).classList.add('current')
                    node.classList.add('selected')
                    MaaN.route.Copilot[0] = name
                })
                return node
            }
        },
        CopilotScreenSelectorFile: {
            list: [
                {
                    type: "file",
                    target: "tasks.copilot.Copilot.params.filename",
                    path: "copilot"
                }
            ],
            renderer: renderers.config
        },
        CopilotScreenSelectorStart: {
            list: [
                "CopilotScreenMainStartButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'Start'
                node.textContent = MaaN.getText(MaaN.currentSession ? 'Stop' : node.name)
                node.disabled = true
                node.classList.add('startbutton')
                node.addEventListener('click', () => {
                    if (!MaaN.route.Copilot.length) return
                    if (MaaN.route.Copilot[0] == 'SSS') MaaN.startOrStopTasks('ssscopilot')
                    if (MaaN.route.Copilot[0] != 'SSS') MaaN.startOrStopTasks('copilot')
                })
                return node
            }
        },
        CopilotScreenSelectorConfig: {
            list: [
                "CopilotScreenSelectorConfigMainStageStoryCollectionSideStory",
                "CopilotScreenSelectorConfigSSS",
                "CopilotScreenSelectorConfigParadoxSimulation",
                "CopilotScreenSelectorConfigOtherActivityStage"
            ]
        },
        CopilotScreenSelectorConfigMainStageStoryCollectionSideStory: {
            list: [
                {
                    type: "checkbox",
                    name: "AutoSquad",
                    target: "tasks.copilot.Copilot.params.formation"
                },
                {
                    type: "number",
                    name: "LoopTimes",
                    target: "tasks.copilot.Copilot.params.loop_times",
                    horizontal: true
                }
            ],
            renderer: renderers.config
        },
        CopilotScreenSelectorConfigSSS: {
            list: [
                {
                    type: "number",
                    name: "LoopTimes",
                    target: "tasks.ssscopilot.SSSCopilot.params.loop_times",
                    horizontal: true
                }
            ],
            renderer: renderers.config
        },
        CopilotScreenSelectorConfigParadoxSimulation: {
            list: [],
            renderer: renderers.config
        },
        CopilotScreenSelectorConfigOtherActivityStage: {
            list: [
                {
                    type: "checkbox",
                    name: "AutoSquad",
                    target: "tasks.copilot.Copilot.params.formation"
                },
                {
                    type: "number",
                    name: "LoopTimes",
                    target: "tasks.copilot.Copilot.params.loop_times",
                    horizontal: true
                }
            ],
            renderer: renderers.config
        },
        CopilotScreenLogs: {
        }
    },
    Toolbox: {
        ToolboxScreenNav: {
            node: "nav",
            list: [
                // "RecruitmentRecognition",
                "OperBoxRecognition",
                "DepotRecognition",
                // "Gacha",
                // "Peep",
                // "MiniGame"
            ],
            renderer: (name) => {
                const id = 'ToolboxScreenNav' + name
                const node = document.createElement('button')
                node.id = id
                node.textContent = MaaN.getText(name)
                if (MaaN.screen == name) node.classList.add('selected')
                node.addEventListener('click', () => {
                    document.getElementById('ToolboxScreenNav' + MaaN.route.Toolbox[0])?.classList.remove('selected')
                    document.getElementById('ToolboxScreenMain' + MaaN.route.Toolbox[0])?.classList.remove('current')
                    document.getElementById('ToolboxScreenMain' + name).classList.add('current')
                    node.classList.add('selected')
                    MaaN.route.Toolbox[0] = name
                })
                return node
            }
        },
        ToolboxScreenMain: {
            list: [
                "ToolboxScreenMainRecruitmentRecognition",
                "ToolboxScreenMainOperBoxRecognition",
                "ToolboxScreenMainDepotRecognition",
                "ToolboxScreenMainGacha",
                "ToolboxScreenMainPeep",
                "ToolboxScreenMainMiniGame"
            ]
        },
        ToolboxScreenMainRecruitmentRecognition: {
            list: [
                "ToolboxScreenMainRecruitmentRecognitionMessage",
                "ToolboxScreenMainRecruitmentRecognitionResult",
                "ToolboxScreenMainRecruitmentRecognitionConfig"
            ]
        },
        ToolboxScreenMainRecruitmentRecognitionMessage: {
            name: "RecruitmentRecognitionTip"
        },
        ToolboxScreenMainRecruitmentRecognitionResult: {},
        ToolboxScreenMainRecruitmentRecognitionConfig: {
            list: [
                "ToolboxScreenMainRecruitmentRecognitionConfigLeft",
                "ToolboxScreenMainRecruitmentRecognitionConfigRight",
                "ToolboxScreenMainRecruitmentRecognitionConfigStart"
            ]
        },
        ToolboxScreenMainRecruitmentRecognitionConfigLeft: {
            list: [
                {
                    type: "checkbox",
                    name: "AutoSettingTime",
                    target: "temp.recruit.Recruit.params.set_time"
                }
            ],
            renderer: renderers.config
        },
        ToolboxScreenMainRecruitmentRecognitionConfigRight: {
            list: [
                {
                    type: "listbox",
                    name: "AutoSelectLevel3Tags",
                    target: "temp.recruit.Recruit.params.select"
                },
                {
                    type: "listbox",
                    name: "AutoSelectLevel4Tags",
                    target: "temp.recruit.Recruit.params.select"
                },
                {
                    type: "listbox",
                    name: "AutoSelectLevel5Tags",
                    target: "temp.recruit.Recruit.params.select"
                },
                {
                    type: "listbox",
                    name: "AutoSelectLevel6Tags",
                    target: "temp.recruit.Recruit.params.select"
                }
            ],
            renderer: renderers.config
        },
        ToolboxScreenMainRecruitmentRecognitionConfigStart: {
            list: [
                "ToolboxScreenMainRecruitmentRecognitionConfigStartButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'StartToRecruit'
                node.textContent = MaaN.getText(MaaN.currentSession ? 'Stop' : node.name)
                node.disabled = true
                node.classList.add('startbutton')
                node.addEventListener('click', () => {
                    MaaN.startOrStopTasks('recruit')
                })
                return node
            }
        },
        ToolboxScreenMainOperBoxRecognition: {
            list: [
                "ToolboxScreenMainOperBoxRecognitionMessage",
                "ToolboxScreenMainOperBoxRecognitionNav",
                "ToolboxScreenMainOperBoxRecognitionResult",
                "ToolboxScreenMainOperBoxRecognitionStart"
            ]
        },
        ToolboxScreenMainOperBoxRecognitionMessage: {
            name: "OperBoxRecognitionTip"
        },
        ToolboxScreenMainOperBoxRecognitionNav: {
            node: "nav",
            list: [
                "OperBoxNotHaveList",
                "OperBoxHaveList"
            ],
            renderer: (name) => {
                const id = 'ToolboxScreenMainOperBoxRecognitionNav' + name
                const node = document.createElement('button')
                node.id = id
                node.textContent = MaaN.getText(name, ['0'])
                if (MaaN.screen == name) node.classList.add('selected')
                node.addEventListener('click', () => {
                    document.getElementById('ToolboxScreenMainOperBoxRecognitionNav' + MaaN.route.Toolbox[1])?.classList.remove('selected')
                    document.getElementById('ToolboxScreenMainOperBoxRecognitionResult' + MaaN.route.Toolbox[1])?.classList.remove('current')
                    document.getElementById('ToolboxScreenMainOperBoxRecognitionResult' + name).classList.add('current')
                    node.classList.add('selected')
                    MaaN.route.Toolbox[1] = name
                })
                return node
            }
        },
        ToolboxScreenMainOperBoxRecognitionResult: {
            list: [
                "ToolboxScreenMainOperBoxRecognitionResultOperBoxNotHaveList",
                "ToolboxScreenMainOperBoxRecognitionResultOperBoxHaveList"
            ]
        },
        ToolboxScreenMainOperBoxRecognitionResultOperBoxNotHaveList: {},
        ToolboxScreenMainOperBoxRecognitionResultOperBoxHaveList: {},
        ToolboxScreenMainOperBoxRecognitionStart: {
            list: [
                "ToolboxScreenMainOperBoxRecognitionStartLeft",
                "ToolboxScreenMainOperBoxRecognitionStartRight"
            ]
        },
        ToolboxScreenMainOperBoxRecognitionStartLeft: {
            list: [
                "ToolboxScreenMainOperBoxRecognitionStartLeftButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'OperBoxCopyToClipboard'
                node.textContent = MaaN.getText(node.name)
                node.addEventListener('click', () => {
                    Neutralino.clipboard.writeText(JSON.stringify(MaaN.operBoxData.details.own_opers, undefined, 4))
                    document.getElementById('ToolboxScreenMainOperBoxRecognitionMessage').textContent = MaaN.getText('CopiedToClipboard')
                })
                return node
            }
        },
        ToolboxScreenMainOperBoxRecognitionStartRight: {
            list: [
                "ToolboxScreenMainOperBoxRecognitionStartRightButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'StartToOperBoxRecognition'
                node.textContent = MaaN.getText(MaaN.currentSession ? 'Stop' : node.name)
                node.disabled = true
                node.classList.add('startbutton')
                node.addEventListener('click', () => {
                    document.getElementById('ToolboxScreenMainOperBoxRecognitionMessage').textContent = MaaN.getText('Identifying')
                    MaaN.startOrStopTasks('operbox')
                })
                return node
            }
        },
        ToolboxScreenMainDepotRecognition: {
            list: [
                "ToolboxScreenMainDepotRecognitionMessage",
                "ToolboxScreenMainDepotRecognitionResult",
                "ToolboxScreenMainDepotRecognitionStart"
            ]
        },
        ToolboxScreenMainDepotRecognitionMessage: {
            name: "DepotRecognitionTip"
        },
        ToolboxScreenMainDepotRecognitionResult: {
        },
        ToolboxScreenMainDepotRecognitionStart: {
            list: [
                "ToolboxScreenMainDepotRecognitionStartLeft",
                "ToolboxScreenMainDepotRecognitionStartCentre",
                "ToolboxScreenMainDepotRecognitionStartRight"
            ]
        },
        ToolboxScreenMainDepotRecognitionStartLeft: {
            list: [
                "ToolboxScreenMainDepotRecognitionStartLeftButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'ExportToArkplanner'
                node.textContent = MaaN.getText(node.name)
                node.addEventListener('click', () => {
                    Neutralino.clipboard.writeText(MaaN.depotData.details.arkplanner.data)
                    document.getElementById('ToolboxScreenMainDepotRecognitionMessage').textContent = MaaN.getText('CopiedToClipboard')
                })
                return node
            }
        },
        ToolboxScreenMainDepotRecognitionStartCentre: {
            list: [
                "ToolboxScreenMainDepotRecognitionStartCentreButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'ExportToLolicon'
                node.textContent = MaaN.getText(node.name)
                node.addEventListener('click', () => {
                    Neutralino.clipboard.writeText(MaaN.depotData.details.lolicon.data)
                    document.getElementById('ToolboxScreenMainDepotRecognitionMessage').textContent = MaaN.getText('CopiedToClipboard')
                })
                return node
            }
        },
        ToolboxScreenMainDepotRecognitionStartRight: {
            list: [
                "ToolboxScreenMainDepotRecognitionStartRightButton"
            ],
            renderer: (name) => {
                const node = document.createElement('button')
                node.id = name
                node.name = 'StartToDepotRecognition'
                node.textContent = MaaN.getText(MaaN.currentSession ? 'Stop' : node.name)
                node.disabled = true
                node.classList.add('startbutton')
                node.addEventListener('click', () => {
                    MaaN.startOrStopTasks('depot')
                    document.getElementById('ToolboxScreenMainDepotRecognitionMessage').textContent = MaaN.getText('Identifying')
                })
                return node
            }
        },
        ToolboxScreenMainGacha: {},
        ToolboxScreenMainPeep: {},
        ToolboxScreenMainMiniGame: {}
    },
    Settings: {
        SettingsScreenList: {
            node: "ul",
            list: [
                "Profile",
                "-",
                "ProfileSpecific",
                "GameSettings",
                "ConnectionSettings",
                "StartupSettings",
                "-",
                "GlobalScope",
                "ScheduleSettings",
                // "PerformanceSettings",
                // "RemoteControlSettings",
                "UiSettings",
                "BackgroundSettings",
                // "ExternalNotificationSettings",
                // "HotKeySettings",
                "UpdateSettings",
                "-",
                "IssueReport",
                "AboutUs"
            ],
            renderer: (name) => {
                if (name == '-') return document.createElement('hr')
                const id = 'SettingsScreenList' + name
                const node = document.createElement('li')
                node.id = id
                node.textContent = MaaN.getText(name)
                node.addEventListener('click', (e) => {
                    document.getElementById('SettingsScreenMain' + name)?.scrollIntoView({behavior: 'smooth', block: 'start', container: 'nearest'})
                })
                return node
            }
        },
        SettingsScreenMain: {
            list: [
                "Profile",
                "ProfileSpecific",
                "GameSettings",
                "ConnectionSettings",
                "StartupSettings",
                "GlobalScope",
                "ScheduleSettings",
                // "PerformanceSettings",
                // "RemoteControlSettings",
                "UiSettings",
                "BackgroundSettings",
                // "ExternalNotificationSettings",
                // "HotKeySettings",
                "UpdateSettings",
                "IssueReport",
                "AboutUs"
            ],
            renderer: (name) => {
                const id = 'SettingsScreenMain' + name
                const node = document.createElement('div')
                node.id = id
                const header = document.createElement('div')
                header.append(document.createElement('hr'))
                const textNode = document.createElement('div')
                textNode.textContent = MaaN.getText(name)
                header.append(textNode)
                header.append(document.createElement('hr'))
                node.append(header)
                node.append(MaaN.render(MaaN.ScreensCat.Settings, id + 'Container'))
                return node
            }
        },
        SettingsScreenMainProfileSpecificContainer: {
            list: [
                {
                    type: "div",
                    name: "SettingsProfileSpecific"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainProfileContainer: {
            list: [
                {
                    type: "text",
                    name: "Profile",
                    target: "config.profile"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainGameSettingsContainer: {
            list: [
                {
                    type: "select",
                    name: "ClientType",
                    target: "client_type",
                    options: ["Official", "Bilibili", "YoStarEN", "YoStarJP", "YoStarKR", {name: "Txwy", value: "txwy"}],
                    horizontal: true
                },
                {
                    type: "link",
                    name: "HelpUsWithOverseasServersTip",
                    target: "https://docs.maa.plus/{locale}/develop/overseas-client-adaptation.html"
                },
                {
                    type: "checkbox",
                    name: "DeploymentWithPause",
                    target: "profile.instance_options.deployment_with_pause"
                },
                {
                    type: "text",
                    name: "StartsWithScript",
                    target: "config.profile.scripts.pre",
                    placeholder: "ScriptPlaceholderPre"
                },
                {
                    type: "text",
                    name: "EndsWithScript",
                    target: "config.profile.scripts.post",
                    placeholder: "ScriptPlaceholderPost"
                },
                {
                    type: "checkbox",
                    name: "CopilotWithScript",
                    target: "config.profile.scripts.on_copilot"
                },
                {
                    type: "checkbox",
                    name: "ManualStopWithScript",
                    target: "config.profile.scripts.on_manual_stop"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainConnectionSettingsContainer: {
            list: [
                {
                    type: "file",
                    name: "AdbPath",
                    target: "profile.connection.adb_path"
                },
                {
                    type: "text",
                    name: "ConnectionAddress",
                    target: "profile.connection.address"
                },
                {
                    type: "select",
                    name: "ConnectionPreset",
                    target: "profile.connection.config",
                    options: ["General", "BlueStacks", "MuMuEmulator12", "LDPlayer", "Nox", "XYAZ", "WSA", "Compatible", "SecondResolution", "GeneralWithoutScreencapErr", "CompatMac", "CompatPOSIXShell", "Waydroid"]
                },
                {
                    type: "select",
                    name: "TouchMode",
                    target: "profile.instance_options.touch_mode",
                    options: touchModes
                },
                {
                    type: "checkbox",
                    name: "AllowAdbRestart",
                    target: "config.profile.startup.restart_adb_server"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainStartupSettingsContainer: {
            list: [
                {
                    type: "checkbox",
                    name: "MinimizeAfterLaunch",
                    target: "config.profile.startup.minimized"
                },
                {
                    type: "checkbox",
                    name: "RunTaskAfterLaunch",
                    target: "config.profile.startup.run_tasks"
                },
                {
                    type: "checkbox",
                    name: "OpenEmulatorAfterLaunch",
                    target: "config.profile.startup.run_emulator"
                },
                {
                    type: "checkbox",
                    name: "RetryOnDisconnected",
                    target: "config.profile.startup.retry_emulator"
                },
                {
                    type: "file",
                    name: "EmulatorPath",
                    target: "config.profile.startup.emulator_path"
                },
                {
                    type: "text",
                    name: "AdditionCommand",
                    target: "config.profile.startup.emulator_arguments"
                },
                {
                    type: "number",
                    name: "WaitForEmulator",
                    target: "config.profile.startup.delay",
                    horizontal: true
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainGlobalScopeContainer: {
            list: [
                {
                    type: "div",
                    name: "SettingsGlobalScope"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainScheduleSettingsContainer: {
            list: [
                {
                    type: "list",
                    name: "ScheduleSettings",
                    target: "config.schedules",
                    data: [
                        {
                            type: "checkbox",
                            name: "Timer",
                            target: "config.schedules.{index}.enabled"
                        },
                        {
                            type: "time",
                            target: "config.schedules.{index}.time"
                        },
                        {
                            type: "checkbox",
                            name: "ForceScheduledStart",
                            target: "config.schedules.{index}.force"
                        }
                    ],
                    default: {
                        enabled: false,
                        force: false
                    }
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainUiSettingsContainer: {
            list: [
                {
                    type: "checkbox",
                    name: "UseTray",
                    target: "config.ui.tray"
                },
                {
                    type: "checkbox",
                    name: "SystemNotification",
                    target: "config.ui.system_notification"
                },
                {
                    type: "div",
                    name: "TitleBarDisplayContent"
                },
                {
                    type: "checkbox",
                    name: "Profile",
                    target: "config.ui.title_bar.profile"
                },
                {
                    type: "checkbox",
                    name: "ConnectionPreset",
                    target: "config.ui.title_bar.connection_preset"
                },
                {
                    type: "checkbox",
                    name: "ConnectionAddress",
                    target: "config.ui.title_bar.connection_address"
                },
                {
                    type: "checkbox",
                    name: "ClientType",
                    target: "config.ui.title_bar.client_type"
                },
                {
                    type: "select",
                    name: "Language",
                    target: "config.ui.language",
                    options: [{name: "LanguageZhCN", value: "zh-cn"}, {name: "LanguageZhTW", value: "zh-tw"}, {name: "LanguageEnUS", value: "en-us"}, {name: "LanguageJaJP", value: "ja-jp"}, {name: "LanguageKoKR", value: "ko-kr"}]
                },
                {
                    type: "checkbox",
                    name: "OperNameLanguage",
                    target: "config.ui.language_operator_name"
                },
                {
                    type: "select",
                    name: "UiTheme",
                    target: "config.ui.theme",
                    options: [{name: "SyncWithOs", value: "auto"}, {name: "Light", value: "light"}, {name: "Dark", value: "dark"}]
                },
                {
                    type: "checkbox",
                    name: "AmoledDark",
                    target: "config.ui.amoled_dark"
                },
                {
                    type: "text",
                    name: "LogItemDateFormatString",
                    target: "config.ui.time_format"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainBackgroundSettingsContainer: {
            list: [
                {
                    type: "checkbox",
                    name: "BackgroundTransparency",
                    target: "config.ui.background.transparency"
                },
                {
                    type: "file",
                    name: "BackgroundImage",
                    target: "config.ui.background.image"
                },
                {
                    type: "range",
                    name: "BackgroundOpacity",
                    target: "config.ui.background.opacity"
                },
                {
                    type: "range",
                    name: "BackgroundBlurRadius",
                    target: "config.ui.background.blur"
                },
                {
                    type: "select",
                    name: "BackgroundImageStretchMode",
                    target: "config.ui.background.resize",
                    options: [{name: "BackgroundImageStretchModeNone", value: "none"}, {name: "BackgroundImageStretchModeFill", value: "fill"}, {name: "BackgroundImageStretchModeUniform", value: "contain"}, {name: "BackgroundImageStretchModeUniformToFill", value: "cover"}]
                },
                {
                    type: "checkbox",
                    name: "BackgroundImageRepeat",
                    target: "config.ui.background.repeat"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainUpdateSettingsContainer: {
            list: [
                // {
                //     type: "checkbox",
                //     name: "StartupUpdateCheck",
                //     target: "config.update.check_on_start"
                // },
                {
                    type: "checkbox",
                    name: "UpdateAutoDownload",
                    target: "config.update.auto_update"
                },
                {
                    type: "select",
                    name: "UpdateCheck",
                    target: "config.update.channel",
                    options: [{name: "UpdateCheckStable", value: "stable"}, {name: "UpdateCheckBeta", value: "beta"}/*, {name: "UpdateCheckNightly", value: "alpha"} */],
                    horizontal: true
                },
                // {
                //     type: "div",
                //     name: "MaaVersion"
                // },
                // {
                //     type: "div",
                //     name: "CoreVersion"
                // },
                // {
                //     type: "div",
                //     name: "UiVersion"
                // },
                {
                    type: "button",
                    name: "UpdateCheckNow",
                    events: {
                        click: async () => {
                            await MaaN.updateMaaCli()
                            await MaaN.updateMaaCore()
                        }
                    }
                },
                {
                    type: "button",
                    name: "ResourceUpdate",
                    events: {
                        click: MaaN.updateMaaResource
                    }
                },
                {
                    type: "link",
                    name: "ResourceRepository",
                    target: "https://github.com/MaaAssistantArknights/MaaResource"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainIssueReportContainer: {
            list: [
                {
                    type: "link",
                    name: "Help",
                    target: "https://docs.maa.plus/{locale}/manual/faq.html"
                },
                {
                    type: "link",
                    name: "Issue",
                    target: "https://github.com/MaaAssistantArknights/MaaAssistantArknights/issues"
                }
            ],
            renderer: renderers.config
        },
        SettingsScreenMainAboutUsContainer: {
            list: [
                {
                    type: "link",
                    name: "Website",
                    target: "https://maa.plus"
                },
                {
                    type: "link",
                    name: "Bilibili",
                    target: "https://space.bilibili.com/3493274731940507"
                },
                {
                    type: "link",
                    name: "Github",
                    target: "https://github.com/MaaAssistantArknights/MaaAssistantArknights"
                },
                {
                    type: "link",
                    name: "QqGroup",
                    target: "https://qun.qq.com/universal-share/share?busi_data=eyJncm91cENvZGUiOiIxNDc2ODIwNjgiLCJ0b2tlbiI6Im0vWmx3YVBxZlJveGNCSUhtcFJ5NnIzZVRLV1VXb0txY2haWFV4Y0JqUHJxeGRZckMyUTM3SVJ6Yk1FN1ljTm8iLCJ1aW4iOiIzMjA5MzU5OTM0In0=&data=-3Ya4bEmREJX94LiqULiO2TF6apRx0RjGD95g4lGAMJP23o-ox2prF2fqMlG-akzWxLbz3tSIfVqFg5NAZzUr-tXxibaMF4rEKvyMR2Ojwk&svctype=5&tempid=h5_group_info"
                },
                {
                    type: "link",
                    name: "QqChannel",
                    target: "https://pd.qq.com/qqweb/qunpro/share?inviteCode=1XfidBoJVr0"
                },
                {
                    type: "link",
                    name: "Telegram",
                    target: "https://t.me/+Mgc2Zngr-hs3ZjU1"
                },
                {
                    type: "link",
                    name: "Discord",
                    target: "https://discord.com/invite/23DfZ9uA4V"
                }
            ],
            renderer: renderers.config
        }
    }
}

})()