export class edSecure {

  encrytionUser(data: any) {
    let rev = '';
    for (let i = data.length - 1; i >= 0; i--) {
      rev += data[i];
    }
    return rev;
  }

  encrytionNumber(data: any) {
    const n = (data * 5 / 800).toString();
    let rev = '';
    for (let i = n.length - 1; i >= 0; i--) {
      rev += n[i];
    }
    return rev;
  }

  decrytionNumber(data: any) {
    let rev = '';
    for (let i = data.length - 1; i >= 0; i--) {
      rev += data[i];
    }
    const n = (Number.parseFloat(rev) * 800 / 5 ).toString();
    return n;
  }
}

export class roundNumber{
  static roundPrice(price: number): number{
    if(price > 1000){
      const pricestr = price.toString();
      const pricesp = pricestr.slice(-3);
      const pricecut = pricestr.substr(0, pricestr.length - 3);
      if(Number.parseInt(pricesp) >= 800){
        return (Number.parseInt(pricecut.concat('000')) + 1000);
      }else if(Number.parseInt(pricesp) >= 300){
        return Number.parseInt(pricecut.concat('500'));
      }else {
        return Number.parseInt(pricecut.concat('000'));
      }
    }else {
      return price;
    }
  }
}
