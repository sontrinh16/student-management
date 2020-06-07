module.exports = str => {
    const splitName = str.split(' ');

    const newSplitName = splitName.map(item =>{ return item.charAt(0).toUpperCase() + item.slice(1)});

    return newSplitName.join(' ');
}