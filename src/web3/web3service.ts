import MyCreditTokenAbi from '../contracts/MyCreditToken';
import MyShareAbi from '../contracts/MyShare';
import { IShare, IShareParticipate, ParticipantFields } from '../store/shares/types';
import { getAccount, getContract, promisify, watchOnce } from './web3client';
import * as web3client from './web3client';
export * from './web3client';

const tokenContract: any = getContract(MyCreditTokenAbi, '0x021fbcfc3a65ced4d430038ad756415c8d2db8fd');

export async function getToken(address?: string): Promise<number> {
    address = address || getAccount();
    const result = await promisify((f) => tokenContract.balanceOf(address, f));
    return result.toNumber();
}

export async function createNewShare(s: IShare): Promise<string> {
    const { target, share, startInDays, minInterest } = s;
    await promisify((f) => tokenContract.createShare(target, share, startInDays, minInterest, f));
    const shareCreated = await watchOnce(tokenContract.ShareCreated({}, 'latest'));
    return shareCreated && shareCreated.args && shareCreated.args.shareAddr;
}

export async function getParticipatedEvents(isChaired: boolean, account?: string): Promise<IShareParticipate[]> {
    const participateAddr = account || getAccount();

    // tslint:disable-next-line:no-console
    console.log('getParticipatedEvents:', isChaired, participateAddr);

    const events = tokenContract.ShareParticipated({ participant: participateAddr, isChaired}, { fromBlock: 0, toBlock: 'latest' });
    const participatedEvents: any[] = await promisify((f) => events.get(f));

    return participatedEvents.map((event: any) => {
        const data = event.args;
        return {
            address: data.shareAddr,
            isChaired: data.isChaired,
            tokens: data.tokens.toNumber()
        }
    });
}

export async function getShareCreatedEvents(): Promise<IShare[]> {
    const events = tokenContract.ShareCreated({}, { fromBlock: 0, toBlock: 'latest' });
    const shareCreatedEvents: any[] = await promisify((f) => events.get(f));

    // tslint:disable-next-line:no-console
    console.log('shareCreatedEvents: ', shareCreatedEvents);

    return shareCreatedEvents.map((event: any) => {
        const data = event.args;
        const {shareAddr, chairman, targetETH, shareNum, startInMins, minimumInterestETH} = data;
        return {
            address: shareAddr,
            chairman,
            minInterest: minimumInterestETH.toNumber(),
            share: shareNum.toNumber(), 
            startInDays: startInMins.toNumber(), 
            target: targetETH.toNumber(), 
        }
    });
}

export async function getShareDetail(shareAddr: string): Promise<IShare> {
    const myAddress = getAccount();
    const events = tokenContract.ShareCreated({shareAddr}, { fromBlock: 0, toBlock: 'latest' });
    const shareCreatedEvents: any[] = await promisify((f) => events.get(f));
    
    const shareInstance = getContract(MyShareAbi, shareAddr);
    const status = await promisify((f) => shareInstance.status(f));
    const participant = await promisify((f) => shareInstance.participants(myAddress, f));
    const beneficiary = await promisify((f) => shareInstance.currentBeneficiary(f));
    const round = await promisify((f) => shareInstance.payingRound(f));

    const isParticipated = participant[ParticipantFields.addr] === myAddress;

    const data = shareCreatedEvents[0].args;
    const {chairman, targetETH, shareNum, startInMins, minimumInterestETH} = data;
    return {
        address: shareAddr,
        beneficiary,
        chairman,
        isParticipated,
        minInterest: minimumInterestETH.toNumber(),
        participant,
        share: shareNum.toNumber(), 
        startInDays: startInMins.toNumber(), 
        status: status.toNumber(),
        target: targetETH.toNumber(),
        round: round.toNumber()
    }
}

export async function join(address: string): Promise<void> {
    const shareInstance = getContract(MyShareAbi, address);
    const tx = await promisify((f) => shareInstance.join(f));

    return await web3client.waitForReceipt(tx);
}

export async function start(address: string): Promise<void> {
    const shareInstance = getContract(MyShareAbi, address);
    await promisify((f) => shareInstance.start(f));
}

export async function withdraw(address: string): Promise<void> {
    const shareInstance = getContract(MyShareAbi, address);
    await promisify((f) => shareInstance.withdraw(f));
}

export async function nextBeneficiary(address: string): Promise<void> {
    const shareInstance = getContract(MyShareAbi, address);
    await promisify((f) => shareInstance.nextBeneficiary(f));
}

export async function cancelBeforeStart(address: string): Promise<void> {
    const shareInstance = getContract(MyShareAbi, address);
    await promisify((f) => shareInstance.cancelBeforeStart(f));
}