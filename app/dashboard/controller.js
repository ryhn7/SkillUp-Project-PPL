module.exports = {
    index: async (req, res) => {
        try {
            res.render ('admin/dashboard/view_dashboard', {title: 'Express'});
        } catch (error) {
            console.log(error);
        }
    },
}