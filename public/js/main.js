import { cnmGameAddress, cnmNFTAddress, cheddarAddress, cnmGameABI, cnmNFTABI, cheddarABI, HabitatAddress, HabitatABI,
    houseGameAddress, houseGameABI, houseNFTAddress, houseNFTABI } from "./data.js";

(async function() {
    let loginAddress = localStorage.getItem("loginAddress");
    let targetCnmIds = [];
    let targetHouseIds = [];
    let currentPriceCnm, currentPriceHouse, mintPriceCnm, mintPriceHouse, hasCnmPending, hasHousePending;
    let mintCnmAmount = 1;
    let mintHouseAmount = 1;
    const TargetChain = {
        id: "5",
        name: "goerli"
    };

    const provider = new ethers.providers.Web3Provider(web3.currentProvider);
    const signer = provider.getSigner();
    const cnmNFTContract = new ethers.Contract(cnmNFTAddress, cnmNFTABI, provider);
    const cnmGameContract = new ethers.Contract(cnmGameAddress, cnmGameABI, provider);
    const cnmGameWithSigner = cnmGameContract.connect(signer);
    const houseNFTContract = new ethers.Contract(houseNFTAddress, houseNFTABI, provider);
    const CheddarContract = new ethers.Contract(cheddarAddress, cheddarABI, provider);
    const houseGameContract = new ethers.Contract(houseGameAddress, houseGameABI, provider);
    const houseGameWithSigner = houseGameContract.connect(signer);
    const habitatContract = new ethers.Contract(HabitatAddress, HabitatABI, provider);
    const habitatWithSigner = habitatContract.connect(signer);

    function fetchErrMsg (err) {
        console.log("error is ", err);
        console.log("error is ", Object.keys(err));
        const errMsg = err.error ? err.error.message : err.message;
        alert('Error:  ' + errMsg.split(": ")[-1]);
        $("#loading").toggle();
    }

    async function checkChainId () {
        const { chainId } = await provider.getNetwork();
        if (chainId != parseInt(TargetChain.id)) {
            alert("We don't support this chain, please switch to " + TargetChain.name + " and refresh");
            return;
        }
    }

    const toggleLoginBtns = function() {
        if (loginAddress == null) {
            $("#btnLoginBlock").show();
            $("#address").hide();
        } else {
            $("#btnLoginBlock").hide();
            $("#address").text(loginAddress);
            $("#address").show();
        }
    }

    const login = async function () {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
            localStorage.setItem("loginAddress", accounts[0]);
            loginAddress = accounts[0];
        } else {
            localStorage.removeItem("loginAddress");
            loginAddress = null;
        }

        checkLogin();
    }

    const checkLogin = function() {
        toggleLoginBtns();
        getCurrentPrice();
        $("#loading").toggle();
        if (loginAddress) {
            getCheddarBalance();
        }
    }

    const getCheddarBalance = async function () {
        let balance = await CheddarContract.balanceOf(loginAddress);
        balance = ethers.utils.formatEther(balance)
        $("#chedAmount").text(parseFloat(balance).toFixed(4));
    }

    const getCurrentPrice = async function () {
        $("#loading").toggle();
        let price;
        const claimable = await cnmNFTContract.isClaimable();
        if (claimable) {
            const maxToken = await cnmNFTContract.getMaxTokens();
            const minted = await cnmNFTContract.minted();
            price = await cnmGameContract.mintCost(minted + 1, maxToken);
            $("#mintTokenCnm").text("CHEDDAR");
        } else {
            price = await cnmGameContract.MINT_PRICE();
            $("#mintTokenCnm").text("ETH");
        }
        $("#loading").toggle();
        currentPriceCnm = ethers.utils.formatEther(price);
        $("#currentPriceCnm").text(currentPriceCnm);

        const maxHouseToken = await houseNFTContract.getMaxTokens();
        const mintedHouseToken = await houseNFTContract.minted();
        price = await houseGameContract.mintCost(mintedHouseToken + 1, maxHouseToken);
        currentPriceHouse = ethers.utils.formatEther(price);
        $("#currentPriceHouse").text(currentPriceHouse);

        getMintPrice();
    }

    const getMintPrice = function () {
        mintPriceCnm = currentPriceCnm * parseInt(mintCnmAmount);
        $("#mintPriceCnm").text(mintPriceCnm);

        mintPriceHouse = currentPriceHouse * parseInt(mintHouseAmount);
        $("#mintPriceHouse").text(mintPriceHouse);
    }

    const checkPendingMint = async function() {
        hasCnmPending = await cnmGameContract.hasMintPending(loginAddress);

        if (hasCnmPending) {
            $("#revealCnmBtn").show();
            $("#mintCnmBtn, #mintStakeCnmBtn").hide();
        } else {
            $("#revealCnmBtn").hide();
            $("#mintCnmBtn, #mintStakeCnmBtn").show();
        }

        hasHousePending = await houseGameContract.hasMintPending(loginAddress);

        if (hasHousePending) {
            $("#revealHouseBtn").show();
            $("#mintHouseBtn, #mintStakeHouseBtn").hide();
        } else {
            $("#revealHouseBtn").hide();
            $("#mintHouseBtn, #mintStakeHouseBtn").show();
        }
    }

    const reveal = async function(type) {
        $("#loading").toggle();
        let contractSigner = type == "cnm" ? cnmGameWithSigner : houseGameWithSigner;
        let tx = await contractSigner.mintReveal();
        await tx.wait();
        console.log("mint reveal receipt: ", tx);
        alert("Mint success");
        location.reload();
    }

    const mint = async function(stake, type) {
        try {
            $("#loading").toggle();
            let tx;
            if (type == "cnm") {
                const claimable = await cnmNFTContract.isClaimable();
                const price = claimable ? 0 : mintPrice;
                tx = await cnmGameWithSigner.mintCommit(mintCnmAmount, stake, {value: ethers.utils.parseUnits(price.toString(), "ether")});
                await tx.wait();
                console.log("mint commit receipt: ", tx);
                location.reload();
            } else {
                tx = await houseGameWithSigner.mintCommit(mintHouseAmount, stake, {value: "0"});
                await tx.wait();
                console.log("mint commit receipt: ", tx);
                location.reload();
            }
            alert("Mint commit success, please reveal after 5 mins");
        } catch (err) {
            fetchErrMsg(err);
            location.reload();
        }
    }

    const stake = async function(tokenId, type) {
        try {
            $("#loading").toggle();
            let tx;
            if (type == "cnm") {
                targetCnmIds.push(tokenId);
                tx = await habitatWithSigner.addManyToStakingPool(loginAddress, targetCnmIds);
            } else {
                targetHouseIds.push(tokenId);
                tx = await habitatWithSigner.addManyHouseToStakingPool(loginAddress, targetHouseIds);
            }

            await tx.wait();
            console.log("stake receipt: ", tx);
            location.reload();
            alert("Stake success");
        } catch (err) {
            fetchErrMsg(err);
            location.reload();
        }
    }

    const claim = async function(tokenId, unstake, type) {
        try {
            $("#loading").toggle();
            let tx;
            if (type == "cnm") {
                targetCnmIds.push(tokenId);
                tx = await habitatWithSigner.claimManyFromHabitatAndYield(targetIds, unstake);
            } else {
                targetHouseIds.push(tokenId);
                tx = await habitatWithSigner.claimManyHouseFromHabitat([tokenId], unstake);
            }

            await tx.wait();
            console.log("claim receipt: ", tx);
            location.reload();
            alert("Claim success");
        } catch (err) {
            fetchErrMsg(err);
            location.reload();
        }
    }

    if (window.ethereum) {
        checkChainId();
        checkLogin();
        checkPendingMint();

        $("#btnLogin").on('click', function() {
            $("#loading").toggle();
            login();
        })

        // CNM TOKEN
        $("#mintCnmBtn").on('click', function() {
            mint(false, "cnm");
        })

        $("#mintStakeCnmBtn").on('click', function() {
            mint(true, "cnm");
        })

        $("#revealCnmBtn").on('click', function() {
            reveal("cnm");
        })

        $("#stakeCnmBtn").on('click', function() {
            stake($("#stakeTokenId").val(), "cnm");
        })

        $("#claimCnmBtn").on('click', function() {
            claim($("#claimTokenId").val(), false, "cnm");
        })

        $("#unstakeCnmBtn").on('click', function() {
            claim($("#unstakeTokenId").val(), true, "cnm");
        })

        $("#addCnmBtn").on('click', function() {
            if (mintCnmAmount < 4) {
                mintCnmAmount = mintCnmAmount + 1;
                $("#mintCnmAmount").text(mintCnmAmount);
                getMintPrice();
            }
        })

        $("#subCnmBtn").on('click', function() {
            if (mintCnmAmount > 1) {
                mintCnmAmount = mintCnmAmount - 1;
                $("#mintCnmAmount").text(mintCnmAmount);
                getMintPrice();
            }
        })

        // HOUSE TOKEN
        $("#mintHouseBtn").on('click', function() {
            mint(false, "house");
        })

        $("#mintStakeHouseBtn").on('click', function() {
            mint(true, "house");
        })

        $("#revealHouseBtn").on('click', function() {
            reveal("house");
        })

        $("#stakeHouseBtn").on('click', function() {
            stake($("#stakeTokenId").val(), "house");
        })

        $("#claimHouseBtn").on('click', function() {
            claim($("#claimTokenId").val(), false, "house");
        })

        $("#unstakeHouseBtn").on('click', function() {
            claim($("#unstakeTokenId").val(), true, "house");
        })

        $("#addHouseBtn").on('click', function() {
            if (mintHouseAmount < 10) {
                mintHouseAmount = mintHouseAmount + 1;
                $("#mintHouseAmount").text(mintHouseAmount);
                getMintPrice();
            }
        })

        $("#subHouseBtn").on('click', function() {
            if (mintHouseAmount > 1) {
                mintHouseAmount = mintHouseAmount - 1;
                $("#mintHouseAmount").text(mintHouseAmount);
                getMintPrice();
            }
        })

        // detect Metamask account change
        ethereum.on('accountsChanged', function (accounts) {
            console.log('accountsChanges',accounts);
            if (accounts.length > 0) {
                localStorage.setItem("loginAddress", accounts[0]);
                loginAddress = accounts[0];
            } else {
                localStorage.removeItem("loginAddress");
                loginAddress = null;
            }
            toggleLoginBtns();
        });

        // detect Network account change
        ethereum.on('chainChanged', function(networkId){
            console.log('networkChanged',networkId);
            if (networkId != parseInt(TargetChain.id)) {
                alert("We don't support this chain, please switch to " + TargetChain.name);
            }
        });
    } else {
        console.warn("No web3 detected.");
    }
})();
