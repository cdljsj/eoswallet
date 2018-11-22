function importPrivatekey(wallet) { 
    var privatekey = prompt("请输⼊入您需要导⼊入的私钥");
    if(privatekey) {
        let params = {"wallet":wallet, "privatekey":privatekey}
        console.log(params)
        $.post("/wallet/importkey", params, function (res, status) {
            console.log(status, JSON.stringify(res))
            if (res.code == 0) {
            } 
        })
    }
}

function getPublickeyList(name) {
    var password = prompt(`请输入"${name}"钱包的密码`); 
    if(password) {
        let params = {"wallet":name, "password":password}
        console.log(params)
        $.post("/wallet/keys", params, function (res, status) {
            console.log(status, JSON.stringify(res))
            alert(JSON.stringify(res.data))
        })
    } 
}

function unlockWallet(name) {
    var password = prompt(`请输入"${name}"钱包的密码`); 
    if(password) {
        let params = {"wallet":name, "password":password}
        console.log(params)
        $.post("/wallet/unlock", params, function (res, status) {
        }) 
    }
}

function lockWallet(name) {
    let params = {"wallet":name}
    $.post("/wallet/lock", params, function (res, status) {
        console.log(status, JSON.stringify(res))
        alert(JSON.stringify(res.data))
        if (res.code == 0) {
            lockWalletComplete(name)
        } 
    })
}

function getAccountList(name) {
    localStorage.setItem("currentwallet", name)
    window.location.href = "/account.html"
}

function unlockWalletComplete(name) { 
    console.log(name,name.length) 
    $(`#unlock${name}`).text("已解锁") 
    $(`#lock${name}`).text("未锁定") 
    $(`#unlock${name}`).attr({"disabled":"disabled"}) 
    $(`#lock${name}`).attr({"disabled":false}) 
    $(`#importkey${name}`).attr({"disabled":false}) 
    $(`#getkeys${name}`).attr({"disabled":false}) 
    $(`#getaccounts${name}`).attr({"disabled":false})
}

function lockWalletComplete(name) { 
    $(`#unlock${name}`).text("未解锁") 
    $(`#lock${name}`).text("已锁定") 
    $(`#unlock${name}`).attr({"disabled":false}) 
    $(`#lock${name}`).attr({"disabled":"disabled"}) 
    $(`#importkey${name}`).attr({"disabled":"disabled"}) 
    $(`#getkeys${name}`).attr({"disabled":"disabled"}) 
    $(`#getaccounts${name}`).attr({"disabled":"disabled"})
}

$(document).ready(function () {
    //获取钱包列列表
    $.get("/wallet/list", function (res, status) {
            console.log(status, JSON.stringify(res))
            if (res.code == 0) {
                let walletTable = $("#wallet-list-table")
                res.data.forEach(wallet => {
                    let walletName = wallet
                    let isUnlock = false
                    if(wallet.charAt(wallet.length-1)=="*"){
                        isUnlock = true
                        walletName = wallet.slice(0,-2)
                    }
                    let walletTr = `<tr> 
                    <td>${walletName}</td>
                    <td><button id="unlock${walletName}" onclick="unlockWallet('${walletName}')">未解锁</button></td>
                    <td><button id="lock${walletName}" disabled onclick="lockWallet('${walletName}')">已锁定</button></td>
                    <td><button id="importkey${walletName}" disabled onclick="importPrivatekey('${walletName}')">导入私钥
                    <td><button id="getkeys${walletName}" disabled onclick="getPublickeyList('${walletName}')">获取公私钥对
                    <td><button id="getaccounts${walletName}" disabled onclick="getAccountList('${walletName}')">账号列列表</tr>`
                    walletTable.append(walletTr)
                    if(isUnlock){
                        unlockWalletComplete(walletName)
                    }
                });
            }
        })
        
        $("#wallet-create-form").validate({
            rules: {
                wallet: {
                    required: true,
                },
            },
            messages: {
                wallet: {
                    required: "请输⼊入新建的钱包名称",
                }, 
            },
            submitHandler: function (form) {
                $(form).ajaxSubmit({
                    url: "/wallet/create",
                    type: "post",
                    dataType: "json",
                    success: function (res, status) {
                        console.log(status + JSON.stringify(res))
                        alert(JSON.stringify(res.data))
                        if (res.code == 0) {
                            window.location.reload()
                            localStorage.setItem(res.data.wallet,res.data.password)
                        }
                    
                    },
                    error: function (res, status) {
                        console.log(status + JSON.stringify(res))
                    }
                }); 
            }
        })

        $("#wallet-open-form").validate({
            rules: {
                wallet: {
                    required: true,
                },
            },
            messages: {
                wallet: {
                    required: "请输⼊入要打开的钱包名称",
                }, 
            },
            submitHandler: function (form) {
                $(form).ajaxSubmit({
                    url: "/wallet/open",
                    type: "post",
                    dataType: "json",
                    success: function (res, status) {
                        console.log(status + JSON.stringify(res))
                        if (res.code == 0) {
                            window.location.reload()
                        } else {
                            alert(JSON.stringify(res.data))
                        }
                    },
                    error: function (res, status) {
                        console.log(status + JSON.stringify(res))
                    }
                }); 
            }
        }) 
    })