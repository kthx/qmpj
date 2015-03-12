package com.kthx;

import javax.swing.JButton;
import javax.swing.JApplet;
import javax.swing.JTextArea;
import javax.swing.JTextField;
import javax.swing.SwingUtilities;
import java.awt.Color;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Aufgabe_02 extends JApplet
{
	public JTextArea txtArea;
	public JTextField txtField;
	
	private static final long serialVersionUID = -1898305396029360L;

	public void init(){
		try
	      {
	         SwingUtilities.invokeAndWait(new Runnable() 
	         {
	            public void run() 
	            {
	            	initGUI();
	            }
	         });
	      }
	      catch(Exception e)
	      {
	         System.err.println("GUI-Aufbau fehlgeschlagen");
	      }
	   }
	private void initGUI() {
		getContentPane().setLayout(null);

        this.txtField = new JTextField("test" );
        this.txtField.setBounds(10, 10 , 100,30);

        
        JButton btn = new JButton("add");
        btn.setBounds(120, 10, 60, 30);
        btn.setBackground(Color.YELLOW);
        
        this.txtArea = new JTextArea();
        this.txtArea.setBounds(10 , 50, 180, 180);
        this.txtArea.setText("");
        getContentPane().add(this.txtField);
        getContentPane().add(btn);
        getContentPane().add(this.txtArea);
        
        btn.addActionListener(new AddTextToAreaObserver(this));
        
		
	}
	public class AddTextToAreaObserver implements ActionListener {
		
		private Aufgabe_02 parent;
		
		public AddTextToAreaObserver(Aufgabe_02 parent) {
			this.parent = parent;
			
		}
		
		
		@Override
		public void actionPerformed(ActionEvent arg0) {
            if(this.parent.txtArea.getText().equals("")) {
                this.parent.txtArea.setText(
                        this.parent.txtField.getText()
                );
            }else{
                this.parent.txtArea.setText(
                        this.parent.txtArea.getText()+ "\n" + this.parent.txtField.getText()
                );
            }
			this.parent.txtField.setText("");
		}
	}
}
	