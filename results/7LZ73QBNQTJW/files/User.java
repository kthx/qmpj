
/**
 * @date 2012-04-01
 * @author Kasper Koslowski
 */
public class User {
    private String name;
    
    private Phone phoneNo1;
    private Phone phoneNo2;
    
    public void removePhone1() {
        this.phoneNo1 = null;
    }
    
    public void removePhone2() {
        this.phoneNo2 = null;
    }
    
    public void setPhone1(Phone phone) {
        this.phoneNo1 = phone;
    }
    
    public void setPhone2(Phone phone) {
        this.phoneNo2 = phone;
    }
    
    public Phone getPhone1() {
        return this.phoneNo1;
    }
    
    public Phone getPhone2() {
        return this.phoneNo2;
    }
}
